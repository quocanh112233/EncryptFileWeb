from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes_encrypt, routes_decrypt, routes_keys

app = FastAPI(title="EncryptFileWeb API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_encrypt.router, prefix="/api", tags=["Encryption"])
app.include_router(routes_decrypt.router, prefix="/api", tags=["Decryption"])
app.include_router(routes_keys.router, prefix="/api/keys", tags=["Key Management"])

@app.get("/")
def read_root():
    return {"message": "Welcome to EncryptFileWeb API"}
