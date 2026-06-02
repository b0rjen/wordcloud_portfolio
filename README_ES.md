# Proyecto WordCloud Portfolio

`GeneraWordclouds by b0rjen` es una aplicación full-stack para convertir texto o URLs en nubes de palabras interactivas.

## Tecnología
- Backend: FastAPI, NLTK, BeautifulSoup, Requests, WordCloud, Pillow y NumPy
- Frontend: React, Vite, TypeScript y Tailwind CSS
- Despliegue: un único contenedor Docker, listo para `linux/arm64` / Raspberry Pi

## Arranque local
1. Compila el frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Prepara el backend:
   ```bash
   cd ../backend
   python3.12 -m venv .venv
   source .venv/bin/activate
   python -m pip install -r requirements.txt
   ```
3. Descarga los datos de NLTK:
   ```bash
   python -c "import nltk; [nltk.download(p, download_dir='../nltk_data') for p in ('punkt','punkt_tab','stopwords')]"
   ```
4. Arranca el backend sirviendo el frontend compilado:
   ```bash
   STATIC_DIR=../frontend/dist NLTK_DATA=../nltk_data python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Modo desarrollo
- Arranca primero el backend en `:8000`.
- Después ejecuta el frontend:
  ```bash
  cd frontend
  npm run dev
  ```
- Vite proxya `/generate/*` hacia el backend durante el desarrollo.

## Docker
Construcción:
```bash
docker build -t wordcloud-portfolio .
```

Ejecución:
```bash
docker run --rm -p 8000:8000 wordcloud-portfolio
```

## Variables de entorno
- `STATIC_DIR`: carpeta que FastAPI sirve en `/`. En local usa `../frontend/dist`.
- `NLTK_DATA`: ruta donde se almacenan los recursos de NLTK.

## Endpoints
- `POST /generate/text`
- `POST /generate/url`
- `POST /generate/text/image`
- `POST /generate/url/image`

## Solución de problemas
- Si `wordcloud` no se importa, revisa que `python`, `pip` y `uvicorn` salgan de la misma `venv`.
- Si `uvicorn main:app` intenta usar `/app/static`, define `STATIC_DIR=../frontend/dist` o una carpeta escribible.
- Si el scraping de una URL falla, comprueba que el backend esté en marcha y que la URL sea pública.
