from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from app.services import crypto_service

router = APIRouter()

@router.post("/decrypt")
async def decrypt_text(
    encrypted_base64: str,
    password: str
):
    pass

@router.post("/file/decrypt")
async def decrypt_file_endpoint(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    try:
        generator = crypto_service.decrypt_file_stream_service(
            file=file,
            password=password
        )
        
        original_filename = file.filename
        if original_filename.endswith(".enc"):
            original_filename = original_filename[:-4]
            
        return StreamingResponse(
            generator,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={original_filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
