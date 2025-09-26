import React, { useState } from 'react';
import InputForm from './components/InputForm';
import WordCloudVisualization from './components/WordCloudVisualization';
import { wordCloudAPI } from './services/api';
import { WordCloudData } from './types';
import { AlertCircle, Cloud } from 'lucide-react';

function App() {
  const [wordCloudData, setWordCloudData] = useState<WordCloudData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error('No text or URL provided');
      }

      setWordCloudData(response.data);
    } catch (err: any) {
      console.error('Error generating word cloud:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'An error occurred while generating the word cloud'
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
        throw new Error('No text or URL provided');
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
      console.error('Error downloading image:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'An error occurred while downloading the image'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">WordCloud Generator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform any text or web content into beautiful, interactive word clouds.
            Discover the most frequent words and visualize your content in a new way.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Form */}
          <InputForm
            onSubmit={handleGenerate}
            onDownloadImage={handleDownloadImage}
            loading={loading}
          />

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Word Cloud Visualization */}
          {wordCloudData && (
            <WordCloudVisualization data={wordCloudData} />
          )}

          {/* Loading State */}
          {loading && !wordCloudData && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your content...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with React, FastAPI, and Python • WordCloud Portfolio Project</p>
        </footer>
      </div>
    </div>
  );
}

export default App;