import os
import struct
from typing import Generator, BinaryIO
from app.core import constants, aes_cipher, packer, rsa_cipher

def hybrid_encrypt(file_stream: BinaryIO, public_key_pem: bytes) -> Generator[bytes, None, None]:
    session_key = os.urandom(constants.AES_KEY_SIZE_BYTES)
    iv = os.urandom(constants.IV_SIZE_GCM)
    encrypted_key = rsa_cipher.rsa_encrypt(public_key_pem, session_key)
    
    try:
        file_stream.seek(0, os.SEEK_END)
        content_length = file_stream.tell()
        file_stream.seek(0)
    except:
        content_length = 0

    header = packer.pack_hybrid_header(
        constants.CURRENT_VERSION,
        constants.METHOD_HYBRID_RSA,
        iv,
        encrypted_key,
        content_length
    )
    yield header
    
    encryptor = aes_cipher.create_encryptor(session_key, iv)
    CHUNK_SIZE = 64 * 1024
    
    while True:
        chunk = file_stream.read(CHUNK_SIZE)
        if not chunk:
            break
        yield encryptor.update(chunk)
        
    yield encryptor.finalize()
    yield encryptor.tag

def hybrid_decrypt(blob_stream: BinaryIO, private_key_pem: bytes) -> Generator[bytes, None, None]:
    initial_bytes = blob_stream.read(4)
    if len(initial_bytes) < 4: raise ValueError("Blob start too short")
    version, method, enc_key_len = packer.unpack_hybrid_header_start(initial_bytes)
    
    if method != constants.METHOD_HYBRID_RSA:
        raise ValueError(f"Not a hybrid blob, method: {method}")
        
    encrypted_key = blob_stream.read(enc_key_len)
    if len(encrypted_key) != enc_key_len: raise ValueError("Truncated key")
        
    META_SIZE = constants.IV_SIZE_GCM + constants.LENGTH_SIZE
    meta_bytes = blob_stream.read(META_SIZE)
    if len(meta_bytes) != META_SIZE: raise ValueError("Truncated meta")
    
    iv, content_len = packer.unpack_hybrid_meta(meta_bytes)
    
    try:
        session_key = rsa_cipher.rsa_decrypt(private_key_pem, encrypted_key)
    except Exception:
        raise ValueError("RSA Decryption Failed")
        
    try:
        current_pos = blob_stream.tell()
        blob_stream.seek(-constants.TAG_SIZE, os.SEEK_END)
        tag = blob_stream.read(constants.TAG_SIZE)
        blob_stream.seek(current_pos)
    except:
        raise ValueError("Seek for tag failed")
        
    decryptor = aes_cipher.create_decryptor(session_key, iv, tag)
    CHUNK_SIZE = 64 * 1024
    bytes_remaining = content_len
    
    while bytes_remaining > 0:
        read_size = min(CHUNK_SIZE, bytes_remaining)
        chunk = blob_stream.read(read_size)
        if not chunk: break
        yield decryptor.update(chunk)
        bytes_remaining -= len(chunk)
        
    yield decryptor.finalize()
