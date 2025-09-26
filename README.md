# WordCloud Portfolio Project

**Language / Idioma**: [English](#english) | [Español](#español)

---

## English

A modern full-stack application for generating interactive word clouds from text or web content.

## Features

- **Dual Input Methods**: Generate word clouds from direct text input or by scraping web URLs
- **Multi-language Support**: Supports multiple languages with appropriate stopwords filtering
- **Advanced PowerBI-style Visualization**:
  - Mixed orientations (horizontal and vertical words)
  - Dynamic rotations (-90°, 90°, and subtle angles)
  - Professional color palettes inspired by PowerBI and Tableau
  - Variable font weights (400-800) based on word frequency
  - Absolute positioning with natural layout distribution
- **Interactive Effects**:
  - Hover scaling and z-index management
  - Text shadows for visual depth
  - Smooth transitions and animations
- **Enhanced Statistics Dashboard**:
  - Progress bars showing relative word frequencies
  - Vocabulary diversity metrics
  - Gradient-styled information cards
  - Scrollable top words panel
- **Image Export**: Download word clouds as high-quality PNG images
- **Modern UI**: Responsive React frontend with Tailwind CSS
- **Fast API**: Python FastAPI backend with automatic documentation

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **WordCloud**: Python library for generating word cloud images
- **NLTK**: Natural language processing for text preprocessing
- **BeautifulSoup**: Web scraping for URL content extraction
- **Requests**: HTTP library for web content fetching

### Frontend
- **React 18**: Modern React with TypeScript
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful icon library

## Project Structure

```
wordcloud_portfolio/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── wordcloud_service.py # Core word cloud generation logic
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API integration
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main React component
│   │   └── index.css       # Tailwind CSS imports
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind configuration
└── README.md
```

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Generate Word Cloud Data
- **POST** `/generate/text` - Generate from text input
- **POST** `/generate/url` - Generate from URL content

### Generate Word Cloud Images
- **POST** `/generate/text/image` - Generate PNG image from text
- **POST** `/generate/url/image` - Generate PNG image from URL

### Request Format
```json
{
  "text": "Your text content here...",  // For text input
  "url": "https://example.com",        // For URL input
  "language": "english"                // Language for stopwords
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "word_frequencies": {"word": 10, "example": 5},
    "total_words": 100,
    "unique_words": 50,
    "top_words": {"word": 10, "example": 5}
  }
}
```

## Features in Detail

### Text Processing
- Automatic HTML tag removal
- URL and email address filtering
- Customizable stopwords by language
- Word frequency analysis
- Special character handling

### Word Cloud Visualization
- **PowerBI-inspired Design**: Professional layouts with mixed orientations
- **Dynamic Positioning**: Absolute positioning with collision-aware placement
- **Advanced Color System**: 5 professional color palettes with intensity-based selection
- **Typography Hierarchy**: Variable font weights (400-800) and sizes (14px-64px)
- **Rotation Effects**: Vertical words at ±90°, horizontal words with subtle angles
- **Visual Depth**: Text shadows, gradients, and overlay effects
- **Interactive Hover**: Scale transforms and dynamic z-indexing
- **Performance Optimized**: React.useMemo for efficient re-renders

### Export Functionality
- High-quality PNG generation
- Customizable dimensions
- Professional color schemes
- Automatic file naming with timestamps

## Supported Languages

- English
- Spanish (Español)
- French (Français)
- German (Deutsch)
- Italian (Italiano)
- Portuguese (Português)

## Development Notes

### Backend Architecture
- Service-oriented design with separation of concerns
- Comprehensive error handling and validation
- Automatic NLTK data download on first run
- CORS configuration for frontend integration

### Frontend Architecture
- Component-based React structure with advanced data visualization
- TypeScript for type safety and interface definitions
- Responsive design with Tailwind CSS and custom gradient backgrounds
- Modern React hooks (useMemo) for performance optimization
- Advanced CSS transforms and positioning for dynamic layouts
- Professional color palette system with PowerBI-inspired themes

## Future Enhancements

- User authentication and saved word clouds
- More export formats (SVG, PDF)
- Advanced color scheme customization
- Word cloud shape templates
- Social media sharing integration
- Batch processing for multiple texts/URLs

## Contributing

This is a portfolio project demonstrating full-stack development skills with Python, React, and modern web technologies.

## License

This project is for educational and portfolio purposes.

---

## Español

Una aplicación full-stack moderna para generar nubes de palabras interactivas a partir de texto o contenido web.

## Características

- **Métodos de Entrada Duales**: Genera nubes de palabras desde entrada de texto directo o extrayendo contenido de URLs web
- **Soporte Multi-idioma**: Compatible con múltiples idiomas con filtrado apropiado de palabras vacías
- **Visualización Avanzada Estilo PowerBI**:
  - Orientaciones mixtas (palabras horizontales y verticales)
  - Rotaciones dinámicas (-90°, 90°, y ángulos sutiles)
  - Paletas de colores profesionales inspiradas en PowerBI y Tableau
  - Pesos de fuente variables (400-800) basados en frecuencia de palabras
  - Posicionamiento absoluto con distribución natural del layout
- **Efectos Interactivos**:
  - Escalado hover y gestión de z-index
  - Sombras de texto para profundidad visual
  - Transiciones y animaciones suaves
- **Panel de Estadísticas Mejorado**:
  - Barras de progreso mostrando frecuencias relativas de palabras
  - Métricas de diversidad vocabulario
  - Tarjetas de información con gradientes estilizados
  - Panel de palabras principales con scroll
- **Exportación de Imágenes**: Descarga nubes de palabras como imágenes PNG de alta calidad
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
- **Diseño Inspirado en PowerBI**: Layouts profesionales con orientaciones mixtas
- **Posicionamiento Dinámico**: Posicionamiento absoluto con colocación consciente de colisiones
- **Sistema de Color Avanzado**: 5 paletas de colores profesionales con selección basada en intensidad
- **Jerarquía Tipográfica**: Pesos de fuente variables (400-800) y tamaños (14px-64px)
- **Efectos de Rotación**: Palabras verticales a ±90°, palabras horizontales con ángulos sutiles
- **Profundidad Visual**: Sombras de texto, gradientes y efectos de superposición
- **Hover Interactivo**: Transformaciones de escala e indexación z dinámica
- **Optimizado para Rendimiento**: React.useMemo para re-renderizados eficientes

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
- Estructura React basada en componentes con visualización avanzada de datos
- TypeScript para seguridad de tipos y definiciones de interfaces
- Diseño responsivo con Tailwind CSS y fondos de gradiente personalizados
- Hooks React modernos (useMemo) para optimización de rendimiento
- Transformaciones CSS avanzadas y posicionamiento para layouts dinámicos
- Sistema de paleta de colores profesional con temas inspirados en PowerBI

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