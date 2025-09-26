# Proyecto WordCloud Portfolio

Una aplicación full-stack moderna para generar nubes de palabras interactivas a partir de texto o contenido web.

## Características

- **Métodos de Entrada Duales**: Genera nubes de palabras desde entrada de texto directo o extrayendo contenido de URLs web
- **Soporte Multi-idioma**: Compatible con múltiples idiomas con filtrado apropiado de palabras vacías
- **Visualización Interactiva**: Nube de palabras basada en CSS con efectos hover y tamaño basado en frecuencia
- **Exportación de Imágenes**: Descarga nubes de palabras como imágenes PNG
- **UI Moderna**: Frontend React responsivo con Tailwind CSS
- **API Rápida**: Backend Python FastAPI con documentación automática

## Stack Tecnológico

### Backend
- **FastAPI**: Framework web moderno de Python
- **WordCloud**: Librería Python para generar imágenes de nubes de palabras
- **NLTK**: Procesamiento de lenguaje natural para preprocesamiento de texto
- **BeautifulSoup**: Web scraping para extracción de contenido de URLs
- **Requests**: Librería HTTP para obtener contenido web

### Frontend
- **React 18**: React moderno con TypeScript
- **Vite**: Herramienta de construcción rápida y servidor de desarrollo
- **Tailwind CSS**: Framework CSS utility-first
- **Axios**: Cliente HTTP para comunicación con API
- **Lucide React**: Librería de iconos hermosos

## Estructura del Proyecto

```
wordcloud_portfolio/
├── backend/
│   ├── main.py              # Punto de entrada de la aplicación FastAPI
│   ├── wordcloud_service.py # Lógica principal de generación de nubes de palabras
│   └── requirements.txt     # Dependencias de Python
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Integración con API
│   │   ├── types/          # Definiciones de tipos TypeScript
│   │   ├── App.tsx         # Componente principal React
│   │   └── index.css       # Importaciones de Tailwind CSS
│   ├── package.json        # Dependencias de Node.js
│   └── tailwind.config.js  # Configuración de Tailwind
└── README.md
```

## Configuración e Instalación

### Configuración del Backend

1. Navegar al directorio backend:
   ```bash
   cd backend
   ```

2. Crear un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Ejecutar el servidor FastAPI:
   ```bash
   python main.py
   ```

La API estará disponible en `http://localhost:8000`
Documentación de la API en `http://localhost:8000/docs`

### Configuración del Frontend

1. Navegar al directorio frontend:
   ```bash
   cd frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend estará disponible en `http://localhost:5173`

## Endpoints de la API

### Generar Datos de Nube de Palabras
- **POST** `/generate/text` - Generar desde entrada de texto
- **POST** `/generate/url` - Generar desde contenido de URL

### Generar Imágenes de Nube de Palabras
- **POST** `/generate/text/image` - Generar imagen PNG desde texto
- **POST** `/generate/url/image` - Generar imagen PNG desde URL

### Formato de Solicitud
```json
{
  "text": "Tu contenido de texto aquí...",  // Para entrada de texto
  "url": "https://example.com",           // Para entrada de URL
  "language": "english"                   // Idioma para palabras vacías
}
```

### Formato de Respuesta
```json
{
  "success": true,
  "data": {
    "word_frequencies": {"palabra": 10, "ejemplo": 5},
    "total_words": 100,
    "unique_words": 50,
    "top_words": {"palabra": 10, "ejemplo": 5}
  }
}
```

## Características en Detalle

### Procesamiento de Texto
- Eliminación automática de etiquetas HTML
- Filtrado de URLs y direcciones de correo electrónico
- Palabras vacías personalizables por idioma
- Análisis de frecuencia de palabras
- Manejo de caracteres especiales

### Visualización de Nube de Palabras
- Tamaño de fuente basado en frecuencia
- Codificación de color por importancia de palabra
- Efectos hover con visualización de frecuencia
- Panel resumen de palabras principales
- Diseño responsivo

### Funcionalidad de Exportación
- Generación PNG de alta calidad
- Dimensiones personalizables
- Esquemas de color profesionales
- Nombrado automático de archivos con marcas de tiempo

## Idiomas Soportados

- Inglés (English)
- Español
- Francés (Français)
- Alemán (Deutsch)
- Italiano
- Portugués (Português)

## Notas de Desarrollo

### Arquitectura del Backend
- Diseño orientado a servicios con separación de responsabilidades
- Manejo comprehensivo de errores y validación
- Descarga automática de datos NLTK en primera ejecución
- Configuración CORS para integración con frontend

### Arquitectura del Frontend
- Estructura React basada en componentes
- TypeScript para seguridad de tipos
- Diseño responsivo con Tailwind CSS
- Hooks React modernos y gestión de estado

## Mejoras Futuras

- Autenticación de usuario y nubes de palabras guardadas
- Más formatos de exportación (SVG, PDF)
- Personalización avanzada de esquemas de color
- Plantillas de formas de nubes de palabras
- Integración para compartir en redes sociales
- Procesamiento por lotes para múltiples textos/URLs

## Contribución

Este es un proyecto de portfolio que demuestra habilidades de desarrollo full-stack con Python, React y tecnologías web modernas.

## Licencia

Este proyecto es para propósitos educativos y de portfolio.