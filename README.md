# WordCloud Portfolio

**Language / Idioma**: [English](#english) | [Español](#español)

---

## English

`GeneraWordclouds by b0rjen` is a full-stack app for turning text or URLs into interactive word clouds.

### What it uses
- Backend: FastAPI, NLTK, BeautifulSoup, Requests, WordCloud, Pillow, NumPy
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Deployment: single Docker container, ready for `linux/arm64` / Raspberry Pi

### Local start
1. Install the frontend and build it:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Create the backend virtualenv and install dependencies:
   ```bash
   cd ../backend
   python3.12 -m venv .venv
   source .venv/bin/activate
   python -m pip install -r requirements.txt
   ```
3. Download the NLTK data once:
   ```bash
   python -c "import nltk; [nltk.download(p, download_dir='../nltk_data') for p in ('punkt','punkt_tab','stopwords')]"
   ```
4. Start FastAPI serving the built frontend:
   ```bash
   STATIC_DIR=../frontend/dist NLTK_DATA=../nltk_data python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Local dev mode
- Start the backend first on `:8000`.
- Then run the frontend with Vite:
  ```bash
  cd frontend
  npm run dev
  ```
- Vite proxies `/generate/*` to the backend in development.

### Docker
Build the container:
```bash
docker build -t wordcloud-portfolio .
```

Run it:
```bash
docker run --rm -p 8000:8000 wordcloud-portfolio
```

### Environment variables
- `STATIC_DIR`: folder served at `/` by FastAPI. In local development use `../frontend/dist`.
- `NLTK_DATA`: path where the NLTK resources are stored.

### Troubleshooting
- If `wordcloud` cannot be imported, check that `python`, `pip` and `uvicorn` come from the same virtualenv.
- If `uvicorn main:app` fails with `/app/static`, set `STATIC_DIR=../frontend/dist` or another writable folder.
- If URL scraping returns an error, make sure the backend is running and the target URL is publicly reachable.

---

## Español

`GeneraWordclouds by b0rjen` es una aplicación full-stack para convertir texto o URLs en nubes de palabras interactivas.

### Tecnología
- Backend: FastAPI, NLTK, BeautifulSoup, Requests, WordCloud, Pillow, NumPy
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Despliegue: un único contenedor Docker, listo para `linux/arm64` / Raspberry Pi

### Arranque local
1. Instala y compila el frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Crea la venv del backend e instala dependencias:
   ```bash
   cd ../backend
   python3.12 -m venv .venv
   source .venv/bin/activate
   python -m pip install -r requirements.txt
   ```
3. Descarga los datos de NLTK una sola vez:
   ```bash
   python -c "import nltk; [nltk.download(p, download_dir='../nltk_data') for p in ('punkt','punkt_tab','stopwords')]"
   ```
4. Arranca FastAPI sirviendo el frontend compilado:
   ```bash
   STATIC_DIR=../frontend/dist NLTK_DATA=../nltk_data python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Modo desarrollo
- Arranca primero el backend en `:8000`.
- Después ejecuta el frontend con Vite:
  ```bash
  cd frontend
  npm run dev
  ```
- Vite proxya `/generate/*` hacia el backend durante desarrollo.

### Docker
Construir la imagen:
```bash
docker build -t wordcloud-portfolio .
```

Ejecutar el contenedor:
```bash
docker run --rm -p 8000:8000 wordcloud-portfolio
```

### Variables de entorno
- `STATIC_DIR`: carpeta que FastAPI sirve en `/`. En local usa `../frontend/dist`.
- `NLTK_DATA`: ruta donde se almacenan los recursos de NLTK.

### Problemas típicos
- Si `wordcloud` no se importa, revisa que `python`, `pip` y `uvicorn` salgan de la misma `venv`.
- Si `uvicorn main:app` intenta usar `/app/static`, define `STATIC_DIR=../frontend/dist` o una carpeta escribible.
- Si el scraping de una URL falla, comprueba que el backend esté en marcha y que la URL sea pública.
