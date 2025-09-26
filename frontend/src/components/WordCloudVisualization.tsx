import React from 'react';
import { WordCloudData } from '../types';

interface WordCloudVisualizationProps {
  data: WordCloudData;
}

const WordCloudVisualization: React.FC<WordCloudVisualizationProps> = ({ data }) => {
  const maxFrequency = Math.max(...Object.values(data.word_frequencies));

  const getWordSize = (frequency: number): number => {
    const minSize = 12;
    const maxSize = 48;
    return minSize + ((frequency / maxFrequency) * (maxSize - minSize));
  };

  const getWordColor = (frequency: number): string => {
    const intensity = frequency / maxFrequency;
    const hue = 240 - (intensity * 120); // Blue to red
    return `hsl(${hue}, 70%, 50%)`;
  };

  const words = Object.entries(data.word_frequencies)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50); // Show top 50 words

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Word Cloud Visualization</h3>
        <div className="text-sm text-gray-600 mt-2">
          <span className="mr-4">Total words: {data.total_words}</span>
          <span>Unique words: {data.unique_words}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center items-center min-h-[300px] p-4 bg-gray-50 rounded-lg">
        {words.map(([word, frequency], index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block transition-transform hover:scale-110 cursor-pointer font-medium"
            style={{
              fontSize: `${getWordSize(frequency)}px`,
              color: getWordColor(frequency),
              lineHeight: 1.2,
            }}
            title={`${word}: ${frequency} occurrences`}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium text-gray-900 mb-2">Top Words:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(data.top_words).slice(0, 12).map(([word, frequency]) => (
            <div key={word} className="bg-blue-50 px-3 py-1 rounded-md text-sm">
              <span className="font-medium text-blue-900">{word}</span>
              <span className="text-blue-600 ml-1">({frequency})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordCloudVisualization;