import React, { useState } from 'react';
import { Link, Type, Loader2, Download } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Word Cloud</h2>
        <p className="text-gray-600">
          Create beautiful word clouds from text or web content
        </p>
      </div>

      {/* Input Type Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setInputType('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
            inputType === 'text'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Type size={18} />
          Text Input
        </button>
        <button
          type="button"
          onClick={() => setInputType('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
            inputType === 'url'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Link size={18} />
          URL Input
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language Selection */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="english">English</option>
            <option value="spanish">Español</option>
            <option value="french">Français</option>
            <option value="german">Deutsch</option>
            <option value="italian">Italiano</option>
            <option value="portuguese">Português</option>
          </select>
        </div>

        {/* Input Field */}
        {inputType === 'text' ? (
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Word Cloud'
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!isValid || loading}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download PNG
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;