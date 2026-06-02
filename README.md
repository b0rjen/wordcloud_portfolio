# Proyecto WordCloud Portfolio

Aplicación full-stack para generar nubes de palabras interactivas a partir de texto o contenido web. El backend está hecho con FastAPI y NLP con NLTK, y el frontend con React, Vite, TypeScript y Tailwind CSS.

## Características

- Entrada por texto o por URL.
- Procesamiento de texto con limpieza, tokenización y filtrado de stopwords.
- Generación de datos de frecuencia y de imágenes PNG.
- Visualización interactiva con animación opcional.
- Frontend servido por FastAPI en el mismo origen.
- Docker multi-stage listo para `linux/arm64` / Raspberry Pi.

## Stack

- Backend: FastAPI, WordCloud, NLTK, BeautifulSoup, Requests, Pillow, NumPy.
- Frontend: React 18, Vite, TypeScript, Tailwind CSS, Axios, Lucide React.

## Estructura

```text
wordcloud_portfolio/
├── backend/
│   ├── main.py
│   ├── wordcloud_service.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── Dockerfile
└── .dockerignore
```

## Ejecución local

### 1. Frontend

```bash
cd frontend
npm install
npm run build
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
STATIC_DIR=../frontend/dist NLTK_DATA=../nltk_data uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Abrir la app

- Dashboard: `http://localhost:8000/`
- API: `http://localhost:8000/generate/text`

## Endpoints

- `POST /generate/text`
- `POST /generate/url`
- `POST /generate/text/image`
- `POST /generate/url/image`

## Docker

Construcción de la imagen:

```bash
docker build -t wordcloud-portfolio .
```

Ejecución:

```bash
docker run --rm -p 8000:8000 wordcloud-portfolio
```

## Notas

- Los datos de NLTK se descargan en tiempo de build.
- Las imágenes se generan en memoria; no se escriben PNGs temporales.
- El frontend se sirve desde el propio backend para quedar en el mismo origen que la API.
