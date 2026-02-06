from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from app.core import constants

def derive_key(password: str, salt: bytes) -> bytes:
    if not salt:
        raise ValueError("Salt must not be empty")
        
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=constants.AES_KEY_SIZE_BYTES,
        salt=salt,
        iterations=constants.PBKDF2_ITERATIONS,
        backend=default_backend()
    )
    
    return kdf.derive(password.encode('utf-8'))
