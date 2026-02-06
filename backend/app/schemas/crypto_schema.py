from pydantic import BaseModel, Field

class EncryptRequest(BaseModel):
    text: str = Field(..., description="Văn bản cần mã hóa (hỗ trợ Unicode/Tiếng Việt)")
    password: str = Field(..., min_length=1, description="Mật khẩu mã hóa")
    method: str = Field("aes", description="Phương thức mã hóa (hiện tại chỉ trỗ trợ 'aes')")

class EncryptResponse(BaseModel):
    encrypted_base64: str = Field(..., description="Kết quả mã hóa dạng chuỗi Base64")

class DecryptRequest(BaseModel):
    encrypted_base64: str = Field(..., description="Chuỗi Base64 cần giải mã")
    password: str = Field(..., min_length=1, description="Mật khẩu giải mã")

class DecryptResponse(BaseModel):
    decrypted_text: str = Field(..., description="Văn bản gốc sau khi giải mã")
