# EncryptFileWeb

EncryptFileWeb là ứng dụng web bảo mật, phi trạng thái (stateless) và hiệu năng cao dành cho việc mã hóa và giải mã tệp tin. Ứng dụng hỗ trợ cả phương pháp mã hóa đối xứng (AES-GCM) và bất đối xứng (RSA Hybrid), được thiết kế để xử lý các tệp tin kích thước lớn một cách hiệu quả thông qua công nghệ streaming.

Dự án được xây dựng dựa trên FastAPI (Backend) và React + Vite (Frontend).

## Tính Năng Chính

- Streaming Cryptography: Mã hóa và giải mã các tệp tin kích thước lớn (hàng Gigabyte) với mức tiêu thụ RAM tối thiểu sử dụng Python generators và streaming responses.
- Mã hóa AES-GCM: Mã hóa đối xứng dựa trên mật khẩu với cơ chế xác thực toàn vẹn.
- Mã hóa RSA Hybrid: Mã hóa nâng cao sử dụng cặp khóa Công khai/Bí mật (Public/Private Key).
  - Sinh cặp khóa RSA 2048-bit trực tiếp qua API.
  - Sử dụng AES-GCM để mã hóa dữ liệu và RSA-OAEP (SHA-256) để mã hóa khóa phiên (session key).
- Giao diện Hiện đại (UI/UX):
  - Giao diện sạch sẽ, thân thiện xây dựng với Tailwind CSS.
  - Key Tools: Sinh và tải xuống khóa RSA trực tiếp trên trình duyệt.
  - Đầu vào thông minh: Hỗ trợ kéo-thả tệp, tải lên tệp khóa (.pem), và tự động phát hiện phương pháp giải mã từ header của tệp.
- Hỗ trợ Docker: Sẵn sàng triển khai container với Docker Compose và Nginx.

## Công Nghệ Sử Dụng

### Backend

- Ngôn ngữ: Python 3.11+
- Framework: FastAPI (Framework bất đồng bộ hiệu năng cao)
- Thư viện mã hóa: cryptography (Hazmat primitives), secrets
- Server: Uvicorn (ASGI)

### Frontend

- Framework: React 19 (Vite Build Tool)
- Ngôn ngữ: TypeScript
- Giao diện: Tailwind CSS v3
- Thư viện Icon: Lucide React
- Networking: Axios

---

## Hướng Dẫn Cài Đặt

### Yêu Cầu Tiên Quyết

- Python 3.11 hoặc cao hơn
- Node.js 18 hoặc cao hơn
- Docker và Docker Compose (Tùy chọn, nếu muốn chạy container)

### 1. Chạy Cục Bộ (Môi trường Phát triển)

#### Thiết lập Backend

```bash
cd backend

# Tạo môi trường ảo (virtual environment)
python -m venv venv

# Kích hoạt môi trường ảo
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# Cài đặt thư viện phụ thuộc
pip install -r requirements.txt

# Khởi chạy Server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API sẽ chạy tại địa chỉ: http://localhost:8000

#### Thiết lập Frontend

```bash
cd frontend

# Cài đặt thư viện phụ thuộc
npm install

# Khởi chạy Dev Server
npm run dev
```

Frontend sẽ chạy tại địa chỉ: http://localhost:5173

---

### 2. Chạy với Docker (Khuyến nghị)

Khởi chạy toàn bộ hệ thống chỉ với một lệnh duy nhất.

```bash
# Tại thư mục gốc của dự án
docker-compose up --build
```

- Frontend: Truy cập tại http://localhost:5173 (Map vào port 80 trong container)
- Backend: Truy cập tại http://localhost:8000

---

## Hướng Dẫn Sử Dụng

1. Sinh Khóa (Tùy chọn cho chế độ Hybrid):
   - Truy cập tab Key Tools.
   - Nhấn nút "Generate New Key Pair".
   - Tải xuống public_key.pem (chia sẻ cho người gửi) và private_key.pem (giữ bí mật tuyệt đối).

2. Mã Hóa Dữ Liệu (Encrypt):
   - Chọn Kiểu Đầu Vào (Input Type): Văn bản (Text) hoặc Tệp tin (File).
   - Chọn Phương Pháp (Method):
     - AES-GCM: Nhập mật khẩu mạnh.
     - RSA Hybrid: Tải lên tệp public_key.pem của người nhận.
   - Nhấn ENCRYPT NOW. Tệp tin (.enc) hoặc văn bản đã mã hóa sẽ được tải xuống.

3. Giải Mã Dữ Liệu (Decrypt):
   - Chọn tệp tin đã mã hóa hoặc dán văn bản mã hóa.
   - Cung cấp thông tin xác thực (Credential):
     - Nếu mã hóa bằng Mật khẩu: Nhập mật khẩu.
     - Nếu mã hóa bằng RSA: Tải lên tệp private_key.pem của bạn.
   - Nhấn DECRYPT NOW. Hệ thống sẽ tự động phát hiện phương pháp mã hóa từ header của tệp và giải mã.

## Cấu Trúc Dự Án

```
EncryptFileWeb/
├── backend/                # FastAPI Backend
│   ├── app/
│   │   ├── api/            # Các Route Handlers
│   │   ├── core/           # Logic Mã hóa (AES, RSA, Hybrid, Stream)
│   │   ├── schemas/        # Pydantic Models
│   │   ├── services/       # Lớp nghiệp vụ (Business Logic Layer)
│   │   └── main.py         # Điểm khởi chạy ứng dụng
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Các Component (Encrypt, Decrypt, KeyTools)
│   │   ├── assets/
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── tailwind.config.js
│
├── docker-compose.yml      # Cấu hình Docker Compose
└── README.md
```

## Lưu Ý Về Bảo Mật

- Khóa Bí Mật (Private Keys): Ứng dụng sinh khóa trên server nhưng KHÔNG BAO GIỜ lưu trữ chúng. Sau khi sinh và gửi về frontend, chúng sẽ được xóa khỏi bộ nhớ server ngay lập tức.
- Streaming: Dữ liệu được xử lý theo từng phần nhỏ (chunk 64KB). Tệp tin lớn không bao giờ được nạp toàn bộ vào RAM, ngăn chặn các cuộc tấn công làm tràn bộ nhớ.
- Tính Toàn Vẹn: AES-GCM cung cấp tính năng xác thực. Nếu bản mã (ciphertext) bị can thiệp hoặc chỉnh sửa, việc giải mã sẽ thất bại ngay lập tức để đảm bảo an toàn.
