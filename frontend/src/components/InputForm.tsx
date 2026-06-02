import React, { useState } from 'react';
import { Download, FileText, Globe2, Languages, Loader2, Sparkles } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: { text?: string; url?: string; language: string }) => void;
  onDownloadImage: (data: { text?: string; url?: string; language: string }) => void;
  loading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, onDownloadImage, loading }) => {
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('english');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      language,
      ...(inputType === 'text' ? { text } : { url }),
    };
    onSubmit(data);
  };

  const handleDownload = () => {
    const data = {
      language,
      ...(inputType === 'text' ? { text } : { url }),
    };
    onDownloadImage(data);
  };

  const isValid = inputType === 'text' ? text.trim() : url.trim();

  return (
    <div className="surface-card surface-card-hover p-6 md:p-8">
      <div className="card-header">
        <div>
          <p className="section-kicker">Entrada</p>
          <h2 className="section-title mt-2">Genera una nube de palabras</h2>
          <p className="section-copy mt-3">
            Usa texto directo o una URL pública para obtener frecuencias, estadísticas e imagen PNG.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-[var(--border-color)] bg-[rgba(249,115,22,0.1)] p-3 text-[var(--primary-light)] md:flex">
          <Sparkles size={20} />
        </div>
      </div>

      {/* Input Type Toggle */}
      <div className="toggle-shell mb-6">
        <button
          type="button"
          onClick={() => setInputType('text')}
          className={`toggle-button flex items-center justify-center gap-2 ${
            inputType === 'text'
              ? 'toggle-button--active'
              : 'toggle-button--idle'
          }`}
        >
          <FileText size={18} />
          Texto
        </button>
        <button
          type="button"
          onClick={() => setInputType('url')}
          className={`toggle-button flex items-center justify-center gap-2 ${
            inputType === 'url'
              ? 'toggle-button--active'
              : 'toggle-button--idle'
          }`}
        >
          <Globe2 size={18} />
          URL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language Selection */}
        <div>
          <label htmlFor="language" className="field-label">
            <Languages size={16} className="text-[var(--primary-light)]" />
            Idioma
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="select-shell"
          >
            <option value="english">Inglés</option>
            <option value="spanish">Español</option>
            <option value="french">Français</option>
            <option value="german">Deutsch</option>
            <option value="italian">Italiano</option>
            <option value="portuguese">Português</option>
          </select>
          <p className="input-hint mt-2">
            El idioma cambia el filtrado de palabras vacías.
          </p>
        </div>

        {/* Input Field */}
        {inputType === 'text' ? (
          <div>
            <label htmlFor="text" className="field-label">
              <FileText size={16} className="text-[var(--primary-light)]" />
              Texto
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Pega tu texto aquí..."
              rows={6}
              className="textarea-shell"
              required
            />
            <p className="input-hint mt-2">
              Puedes pegar artículos, notas, descripciones o cualquier bloque de texto.
            </p>
          </div>
        ) : (
          <div>
            <label htmlFor="url" className="field-label">
              <Globe2 size={16} className="text-[var(--primary-light)]" />
              URL del sitio web
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="input-shell"
              required
            />
            <p className="input-hint mt-2">
              Ideal para artículos públicos, blogs o páginas con contenido legible.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid gap-3 pt-2 md:grid-cols-2">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="primary-button"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generando...
              </>
            ) : (
              'Generar nube'
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!isValid || loading}
            className="secondary-button"
          >
            <Download size={18} />
            Descargar PNG
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
