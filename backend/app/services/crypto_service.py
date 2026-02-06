from fastapi import UploadFile
from fastapi.responses import Response, StreamingResponse
from app.core import crypto_engine

# ... (Encrypt/Decrypt Text Service - Keep as is)

def encrypt_text_service(text: str, password: str, method: str) -> str:
    # (Placeholder verify: Giữ nguyên logic cũ đã implement ở bước trước)
    import base64
    data_bytes = text.encode('utf-8')
    encrypted_blob = crypto_engine.encrypt_bytes(data_bytes, password, method)
    return base64.b64encode(encrypted_blob).decode('utf-8')

def decrypt_text_service(base64_blob: str, password: str) -> str:
    # (Placeholder verify: Giữ nguyên logic cũ)
    import base64
    try:
        encrypted_blob = base64.b64decode(base64_blob)
    except Exception:
        raise ValueError("Invalid Base64 string")
    decrypted_bytes = crypto_engine.decrypt_bytes(encrypted_blob, password)
    try:
        return decrypted_bytes.decode('utf-8')
    except UnicodeDecodeError:
        raise ValueError("Decrypted data is not valid UTF-8 text")

# --- Streaming Services ---

def encrypt_file_stream_service(file: UploadFile, password: str, method: str):
    """
    Generator function để stream encryption.
    """
    # UploadFile.file là một SpooledTemporaryFile (có thể seek được)
    return crypto_engine.stream_encrypt(file.file, password, method)

def decrypt_file_stream_service(file: UploadFile, password: str):
    """
    Generator function để stream decryption.
    """
    return crypto_engine.stream_decrypt(file.file, password)
