import { useEffect, useState } from 'react';
import InputForm from './components/InputForm';
import WordCloudVisualization from './components/WordCloudVisualization';
import { wordCloudAPI } from './services/api';
import { WordCloudData } from './types';
import { AlertCircle, Cloud, ArrowRight, Cpu, Layers3, ShieldCheck } from 'lucide-react';

function App() {
  const [wordCloudData, setWordCloudData] = useState<WordCloudData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'GeneraWordclouds by b0rjen';
  }, []);

  const handleGenerate = async (data: { text?: string; url?: string; language: string }) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (data.text) {
        response = await wordCloudAPI.generateFromText({
          text: data.text,
          language: data.language,
        });
      } else if (data.url) {
        response = await wordCloudAPI.generateFromURL({
          url: data.url,
          language: data.language,
        });
      } else {
        throw new Error('No se proporcionó texto ni URL');
      }

      setWordCloudData(response.data);
    } catch (err: any) {
      console.error('Error al generar la nube de palabras:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Ha ocurrido un error al generar la nube de palabras'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async (data: { text?: string; url?: string; language: string }) => {
    setLoading(true);
    setError(null);

    try {
      let blob;
      if (data.text) {
        blob = await wordCloudAPI.generateImageFromText({
          text: data.text,
          language: data.language,
        });
      } else if (data.url) {
        blob = await wordCloudAPI.generateImageFromURL({
          url: data.url,
          language: data.language,
        });
      } else {
        throw new Error('No se proporcionó texto ni URL');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wordcloud-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error al descargar la imagen:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Ha ocurrido un error al descargar la imagen'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient-orb left-[-6rem] top-[-6rem] h-72 w-72 bg-[rgba(249,115,22,0.24)]" />
      <div className="ambient-orb right-[-7rem] top-[12rem] h-80 w-80 bg-[rgba(59,130,246,0.16)]" />
      <div className="ambient-orb bottom-[-8rem] left-[20%] h-96 w-96 bg-[rgba(15,23,42,0.85)]" />

      <div className="page-container page-stack">
        <section className="hero-stack text-center">
          <div className="hero-badge mx-auto">
            <Cloud size={14} />
            <span>FastAPI · React · NLTK · Nubes de palabras</span>
          </div>
          <div className="space-y-5">
            <h1 className="hero-title mx-auto max-w-4xl">GeneraWordclouds by b0rjen</h1>
            <p className="hero-copy mx-auto">
              Convierte textos o URLs en nubes de palabras interactivas, con estadísticas claras,
              exportación PNG en memoria y una interfaz inspirada en un portfolio técnico.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-[var(--text-secondary)]">
            <span className="hero-badge">Texto o URL</span>
            <span className="hero-badge">Sin temporales PNG</span>
            <span className="hero-badge">Frontend y API en el mismo origen</span>
          </div>
        </section>

        <section className="content-stack">
          <InputForm
            onSubmit={handleGenerate}
            onDownloadImage={handleDownloadImage}
            loading={loading}
          />

          {error && (
            <div className="surface-card border border-[rgba(239,68,68,0.35)] bg-[rgba(127,29,29,0.35)] p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-red-300" />
                <div>
                  <h3 className="font-semibold text-red-100">Error</h3>
                  <p className="mt-1 text-sm text-red-100/90">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!wordCloudData && !loading && (
            <div className="surface-card p-6 md:p-8">
              <p className="section-kicker">Siguiente paso</p>
              <h2 className="section-title mt-2">Pega contenido y genera tu nube</h2>
              <p className="section-copy mt-3">
                Puedes usar texto libre o una URL pública. La visualización mostrará las palabras
                más frecuentes y la diversidad del vocabulario procesado.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[rgba(249,115,22,0.18)] p-2 text-[var(--primary-light)]">
                      <ArrowRight size={16} />
                    </div>
                    <div>
                      <p className="stat-card__title">Paso 1</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Añade texto o URL</p>
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[rgba(249,115,22,0.18)] p-2 text-[var(--primary-light)]">
                      <Layers3 size={16} />
                    </div>
                    <div>
                      <p className="stat-card__title">Paso 2</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Procesa palabras y frecuencias</p>
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[rgba(249,115,22,0.18)] p-2 text-[var(--primary-light)]">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <p className="stat-card__title">Paso 3</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Descarga el PNG final</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Cpu size={16} className="text-[var(--primary-light)]" />
                <span>Si usas `npm run dev`, asegúrate de tener el backend corriendo en `:8000`.</span>
              </div>
            </div>
          )}

          {wordCloudData && (
            <WordCloudVisualization data={wordCloudData} />
          )}

          <section className="surface-card surface-card-hover p-6 md:p-8">
            <p className="section-kicker">Resumen técnico</p>
            <h2 className="section-title mt-2 text-center md:text-left">Listo para Raspberry Pi y Caddy</h2>
            <p className="section-copy mt-3 text-center md:text-left">
              El backend predescarga NLTK en build, sirve el frontend estático y genera las imágenes
              en memoria para evitar acumulación de archivos temporales.
            </p>

            <div className="hero-metrics mt-6 md:grid md:grid-cols-3">
              <div className="metric-card">
                <p className="metric-label">Arquitectura</p>
                <p className="metric-value mt-2">Un solo contenedor</p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Procesado</p>
                <p className="metric-value mt-2">Sin PNGs en disco</p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Dependencias</p>
                <p className="metric-value mt-2">NLTK predescargado</p>
              </div>
            </div>
          </section>
        </section>

        <footer className="mt-16 border-t border-[var(--border-color)] pt-6 text-center">
          <p className="footer-text">
            Diseñado por{' '}
            <a className="footer-link" href="https://borjen.dev" target="_blank" rel="noreferrer">
              b0rjen
            </a>{' '}
            para su portfolio.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
