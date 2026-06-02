FROM node:20-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NLTK_DATA=/usr/local/nltk_data \
    STATIC_DIR=/app/static

WORKDIR /app/backend

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /usr/local/nltk_data \
    && python -c "import nltk; [nltk.download(p, download_dir='/usr/local/nltk_data') for p in ('punkt', 'punkt_tab', 'stopwords')]"

COPY backend/ /app/backend/
COPY --from=frontend-build /app/frontend/dist /app/static

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
