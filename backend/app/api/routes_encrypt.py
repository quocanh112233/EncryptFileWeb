from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from app.services import crypto_service

router = APIRouter()

@router.post("/encrypt")
async def encrypt_text(
    text: str = Form(...),
    password: str = Form(""),
    method: str = Form("aes")
):
    # Not fully implemented for Hybrid text in this snippet, assumes generic handle or AES
    pass

@router.post("/file/encrypt")
async def encrypt_file_endpoint(
    file: UploadFile = File(...),
    password: str = Form(...),
    method: str = Form("aes")
):
    try:
        generator = crypto_service.encrypt_file_stream_service(
            file=file,
            password=password,
            method=method
        )
        
        filename = f"{file.filename}.enc"
        return StreamingResponse(
            generator,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
         raise HTTPException(status_code=400, detail=str(e))
