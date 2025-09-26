import React, { useMemo } from 'react';
import { WordCloudData } from '../types';

interface WordCloudVisualizationProps {
  data: WordCloudData;
}

interface WordElement {
  word: string;
  frequency: number;
  size: number;
  color: string;
  orientation: 'horizontal' | 'vertical';
  fontWeight: string;
  x: number;
  y: number;
  rotation: number;
}

const WordCloudVisualization: React.FC<WordCloudVisualizationProps> = ({ data }) => {
  const wordElements = useMemo(() => {
    const maxFrequency = Math.max(...Object.values(data.word_frequencies));
    const words = Object.entries(data.word_frequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 60); // Show top 60 words for better density

    // Professional color palettes inspired by PowerBI
    const colorPalettes = [
      // Blue palette
      ['#1f77b4', '#2ca02c', '#ff7f0e', '#d62728', '#9467bd'],
      // Teal palette
      ['#17becf', '#bcbd22', '#e377c2', '#7f7f7f', '#8c564b'],
      // Modern palette
      ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'],
      // PowerBI inspired
      ['#118dff', '#12239e', '#e66c37', '#6b007b', '#e044a7'],
      // Corporate palette
      ['#005a9d', '#00bcf2', '#40e0d0', '#ff6b6b', '#4ecdc4']
    ];

    const selectedPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

    const getWordSize = (frequency: number): number => {
      const intensity = frequency / maxFrequency;
      const minSize = 14;
      const maxSize = 64;
      return Math.round(minSize + (intensity * (maxSize - minSize)));
    };

    const getWordColor = (frequency: number, index: number): string => {
      const intensity = frequency / maxFrequency;

      // Use palette colors for top words, gradient for others
      if (intensity > 0.7) {
        return selectedPalette[0]; // Strongest color for most frequent
      } else if (intensity > 0.5) {
        return selectedPalette[1];
      } else if (intensity > 0.3) {
        return selectedPalette[2];
      } else if (intensity > 0.15) {
        return selectedPalette[3];
      } else {
        return selectedPalette[4];
      }
    };

    const getFontWeight = (frequency: number): string => {
      const intensity = frequency / maxFrequency;
      if (intensity > 0.7) return '800';
      if (intensity > 0.5) return '700';
      if (intensity > 0.3) return '600';
      if (intensity > 0.15) return '500';
      return '400';
    };

    const getOrientation = (index: number): 'horizontal' | 'vertical' => {
      // Mix of horizontal and vertical orientations like PowerBI
      return Math.random() > 0.25 ? 'horizontal' : 'vertical';
    };

    const getRotation = (orientation: 'horizontal' | 'vertical'): number => {
      if (orientation === 'vertical') {
        return Math.random() > 0.5 ? 90 : -90;
      }
      // Small random rotations for horizontal words
      return (Math.random() - 0.5) * 30; // -15 to +15 degrees
    };

    // Generate positioned elements
    return words.map(([word, frequency], index) => {
      const size = getWordSize(frequency);
      const orientation = getOrientation(index);
      const rotation = getRotation(orientation);

      return {
        word,
        frequency,
        size,
        color: getWordColor(frequency, index),
        orientation,
        fontWeight: getFontWeight(frequency),
        x: Math.random() * 80 + 10, // 10% to 90% of container width
        y: Math.random() * 80 + 10, // 10% to 90% of container height
        rotation
      } as WordElement;
    });
  }, [data.word_frequencies]);

  const maxFrequency = Math.max(...Object.values(data.word_frequencies));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Word Cloud Visualization</h3>
        <div className="text-sm text-gray-600 mt-2">
          <span className="mr-4">Total words: {data.total_words}</span>
          <span>Unique words: {data.unique_words}</span>
        </div>
      </div>

      {/* Modern WordCloud Container */}
      <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-xl overflow-hidden border border-gray-200">
        {wordElements.map((element, index) => (
          <div
            key={`${element.word}-${index}`}
            className="absolute transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer select-none"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
              fontSize: `${element.size}px`,
              color: element.color,
              fontWeight: element.fontWeight,
              fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              zIndex: Math.round(element.frequency),
            }}
            title={`${element.word}: ${element.frequency} occurrences`}
          >
            {element.word}
          </div>
        ))}

        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
      </div>

      {/* Statistics Panel */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Words */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Top Words
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(data.top_words).slice(0, 10).map(([word, frequency]) => {
              const percentage = ((frequency / maxFrequency) * 100).toFixed(1);
              return (
                <div key={word} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-medium text-gray-800">{word}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{frequency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Statistics
          </h4>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.total_words.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Total Words Processed</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.unique_words.toLocaleString()}</div>
              <div className="text-sm text-green-700">Unique Words Found</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round((data.unique_words / data.total_words) * 100)}%</div>
              <div className="text-sm text-purple-700">Vocabulary Diversity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCloudVisualization;