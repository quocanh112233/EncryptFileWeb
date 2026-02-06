from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core import rsa_cipher

router = APIRouter()

class KeyPairResponse(BaseModel):
    private_key: str
    public_key: str

@router.get("/generate", response_model=KeyPairResponse)
async def generate_rsa_keypair():
    try:
        private_pem, public_pem = rsa_cipher.generate_keypair()
        return KeyPairResponse(
            private_key=private_pem.decode('utf-8'),
            public_key=public_pem.decode('utf-8')
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
