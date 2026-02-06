FROM python:3.11-slim

WORKDIR /app

# Upgrade pip and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port (default FastAPI)
EXPOSE 8000

# Run uvicorn server
# Note: In production we might use gunicorn with uvicorn workers, but for this setup uvicorn is fine
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
