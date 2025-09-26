import React, { useMemo, useState, useEffect, useRef } from 'react';
import { WordCloudData } from '../types';
import Tooltip from './Tooltip';

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
  rotationSpeed: number; // rotation velocity
  vx: number; // velocity x
  vy: number; // velocity y
  id: string;
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

    // Generate positioned elements with physics
    return words.map(([word, frequency], index) => {
      const size = getWordSize(frequency);
      const orientation = getOrientation(index);
      const rotation = getRotation(orientation);

      // Velocities based on word frequency (more frequent = slower)
      const intensity = frequency / maxFrequency;
      const baseSpeed = 0.3 + (1 - intensity) * 0.7; // 0.3 to 1.0

      // Rotation speed: slower for bigger/more frequent words, faster for smaller ones
      const rotationSpeed = (Math.random() - 0.5) * (0.5 + (1 - intensity) * 1.5); // -1.0 to 1.0 degrees per frame

      return {
        word,
        frequency,
        size,
        color: getWordColor(frequency, index),
        orientation,
        fontWeight: getFontWeight(frequency),
        x: Math.random() * 70 + 15, // 15% to 85% to avoid edge spawning
        y: Math.random() * 70 + 15, // 15% to 85% to avoid edge spawning
        rotation,
        rotationSpeed,
        vx: (Math.random() - 0.5) * baseSpeed * 2, // Random direction X
        vy: (Math.random() - 0.5) * baseSpeed * 2, // Random direction Y
        id: `${word}-${index}`
      } as WordElement;
    });
  }, [data.word_frequencies]);

  const maxFrequency = Math.max(...Object.values(data.word_frequencies));
  const [animatedElements, setAnimatedElements] = useState<WordElement[]>(wordElements);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimatedElements(wordElements);
  }, [wordElements]);

  useEffect(() => {
    if (!isAnimationEnabled) {
      // Stop animation and reset to original positions
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAnimatedElements(wordElements);
      return;
    }

    const animate = () => {
      setAnimatedElements(prevElements => {
        return prevElements.map(element => {
          let newX = element.x + element.vx;
          let newY = element.y + element.vy;
          let newVx = element.vx;
          let newVy = element.vy;
          let newRotation = element.rotation + element.rotationSpeed;

          // Normalize rotation to keep it between 0-360 degrees for performance
          if (newRotation > 360) newRotation -= 360;
          if (newRotation < 0) newRotation += 360;

          // Bounce off container edges with some padding
          const padding = 5; // 5% padding from edges

          if (newX <= padding || newX >= 100 - padding) {
            newVx = -newVx * 0.8; // Slight dampening on bounce
            newX = newX <= padding ? padding : 100 - padding;
          }

          if (newY <= padding || newY >= 100 - padding) {
            newVy = -newVy * 0.8; // Slight dampening on bounce
            newY = newY <= padding ? padding : 100 - padding;
          }

          return {
            ...element,
            x: newX,
            y: newY,
            rotation: newRotation,
            vx: newVx,
            vy: newVy,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimationEnabled, wordElements]);

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
      <div
        ref={containerRef}
        className="relative w-full h-96 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-xl overflow-hidden border border-gray-200"
      >
        {animatedElements.map((element) => (
          <div
            key={element.id}
            className="absolute cursor-pointer select-none hover:scale-110 hover:z-20 transition-transform duration-200"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
              fontSize: `${element.size}px`,
              color: element.color,
              fontWeight: element.fontWeight,
              fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
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

          {/* Animation Control */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Modo de visualización
              </label>
              <div className="relative bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setIsAnimationEnabled(false)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                    !isAnimationEnabled
                      ? 'bg-red-500 text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Estático
                </button>
                <button
                  onClick={() => setIsAnimationEnabled(true)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                    isAnimationEnabled
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Animado
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {isAnimationEnabled
                  ? 'Las palabras se mueven y rotan continuamente'
                  : 'Visualización tradicional sin movimiento'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Statistics
          </h4>
          <div className="space-y-3">
            <Tooltip
              content="Total number of words analyzed from your input text or URL content, including all repetitions. This represents the complete volume of text processed by the system."
              position="left"
              delay={400}
            >
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 rounded-lg cursor-help transition-transform duration-200 hover:scale-105 hover:shadow-md">
                <div className="text-2xl font-bold text-blue-600">{data.total_words.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Total Words Processed</div>
              </div>
            </Tooltip>

            <Tooltip
              content="Number of distinct words discovered after removing duplicates and filtering out common stopwords (like 'the', 'and', 'is'). This shows the actual vocabulary richness of your content."
              position="left"
              delay={400}
            >
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 rounded-lg cursor-help transition-transform duration-200 hover:scale-105 hover:shadow-md">
                <div className="text-2xl font-bold text-green-600">{data.unique_words.toLocaleString()}</div>
                <div className="text-sm text-green-700">Unique Words Found</div>
              </div>
            </Tooltip>

            <Tooltip
              content="Percentage representing vocabulary richness - calculated as (unique words ÷ total words) × 100. Higher percentages indicate more diverse and varied language use, while lower percentages suggest more repetitive content."
              position="left"
              delay={400}
            >
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 rounded-lg cursor-help transition-transform duration-200 hover:scale-105 hover:shadow-md">
                <div className="text-2xl font-bold text-purple-600">{Math.round((data.unique_words / data.total_words) * 100)}%</div>
                <div className="text-sm text-purple-700">Vocabulary Diversity</div>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCloudVisualization;