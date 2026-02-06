import struct
from app.core import constants

def pack_hybrid_header(version: int, method: int, iv: bytes, encrypted_key: bytes, content_length: int) -> bytes:
    enc_key_len = len(encrypted_key)
    header_fmt = f'>BBH{enc_key_len}s{constants.IV_SIZE_GCM}sQ'
    return struct.pack(header_fmt, version, method, enc_key_len, encrypted_key, iv, content_length)

def unpack_hybrid_header_start(stream_chunk: bytes) -> tuple:
    if len(stream_chunk) < 4:
         raise ValueError("Chunk too small for header start")
    return struct.unpack('>BBH', stream_chunk[:4])

def unpack_hybrid_meta(stream_chunk: bytes) -> tuple:
    SIZE_META = constants.IV_SIZE_GCM + constants.LENGTH_SIZE
    if len(stream_chunk) != SIZE_META:
        raise ValueError("Invalid meta chunk size")
    return struct.unpack(f'>{constants.IV_SIZE_GCM}sQ', stream_chunk)
