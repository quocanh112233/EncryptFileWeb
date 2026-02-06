import os
import struct
from typing import Generator, BinaryIO
from app.core import constants, kdf, aes_cipher, hybrid_cipher

CHUNK_SIZE = 64 * 1024

def stream_encrypt(file_stream: BinaryIO, credential: str | bytes, method: str = "aes") -> Generator[bytes, None, None]:
    method_code = constants.METHOD_MAP.get(method.lower())
    if not method_code: 
        if method.lower() == 'hybrid':
             method_code = constants.METHOD_HYBRID_RSA
        else:
             raise ValueError(f"Unknown method {method}")
    
    if method_code == constants.METHOD_AES_GCM:
        password = credential
        if isinstance(password, bytes): password = password.decode('utf-8')
        
        salt = os.urandom(constants.SALT_SIZE)
        iv = os.urandom(constants.IV_SIZE_GCM)
        key = kdf.derive_key(password, salt)
        
        try:
            file_stream.seek(0, os.SEEK_END)
            file_size = file_stream.tell()
            file_stream.seek(0)
        except Exception:
            file_size = 0 

        header_fmt = f'>BB{constants.SALT_SIZE}s{constants.IV_SIZE_GCM}sQ'
        header = struct.pack(header_fmt, constants.CURRENT_VERSION, method_code, salt, iv, file_size)
        yield header
        
        encryptor = aes_cipher.create_encryptor(key, iv)
        while True:
            chunk = file_stream.read(CHUNK_SIZE)
            if not chunk: break
            yield encryptor.update(chunk)
        yield encryptor.finalize()
        yield encryptor.tag
        
    elif method_code == constants.METHOD_HYBRID_RSA:
        public_key = credential
        if isinstance(public_key, str): public_key = public_key.encode('utf-8')
        yield from hybrid_cipher.hybrid_encrypt(file_stream, public_key)
        
    else:
        raise NotImplementedError(f"Method code {method_code} not implemented in stream_encrypt")

def stream_decrypt(file_stream: BinaryIO, credential: str | bytes) -> Generator[bytes, None, None]:
    try:
        header_peek = file_stream.read(2)
        if len(header_peek) < 2: raise ValueError("File too short")
        version, method_code = struct.unpack('>BB', header_peek)
        file_stream.seek(0)
    except Exception:
        raise ValueError("Cannot read header to determine encryption method")
        
    if method_code == constants.METHOD_AES_GCM:
        password = credential
        if isinstance(password, bytes): password = password.decode('utf-8')
        yield from _stream_decrypt_aes(file_stream, password)
        
    elif method_code == constants.METHOD_HYBRID_RSA:
        private_key = credential
        if isinstance(private_key, str): private_key = private_key.encode('utf-8')
        yield from hybrid_cipher.hybrid_decrypt(file_stream, private_key)
        
    else:
        raise ValueError(f"Unknown method code in header: {method_code}")

def _stream_decrypt_aes(file_stream: BinaryIO, password: str):
    HEADER_SIZE = 1 + 1 + constants.SALT_SIZE + constants.IV_SIZE_GCM + constants.LENGTH_SIZE
    header_data = file_stream.read(HEADER_SIZE)
    if len(header_data) < HEADER_SIZE: raise ValueError("File too short")
        
    header_fmt = f'>BB{constants.SALT_SIZE}s{constants.IV_SIZE_GCM}sQ'
    version, method, salt, iv, cis_len = struct.unpack(header_fmt, header_data)
    
    try:
        current_pos = file_stream.tell()
        file_stream.seek(-constants.TAG_SIZE, os.SEEK_END)
        tag = file_stream.read(constants.TAG_SIZE)
        file_stream.seek(current_pos)
    except Exception:
         raise ValueError("Cannot seek for tag")

    key = kdf.derive_key(password, salt)
    decryptor = aes_cipher.create_decryptor(key, iv, tag)
    
    bytes_remaining = cis_len
    while bytes_remaining > 0:
        read_size = min(CHUNK_SIZE, bytes_remaining)
        chunk = file_stream.read(read_size)
        if not chunk: break
        yield decryptor.update(chunk)
        bytes_remaining -= len(chunk)
    yield decryptor.finalize()

def encrypt_bytes(data: bytes, password: str) -> bytes:
    # Legacy wrapper if needed, or unimplemented
    pass
def decrypt_bytes(data: bytes, password: str) -> bytes:
    # Legacy wrapper if needed
    pass
