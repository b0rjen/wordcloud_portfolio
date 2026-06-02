import { useMemo, useState, useEffect, useRef, type FC } from 'react';
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

const WordCloudVisualization: FC<WordCloudVisualizationProps> = ({ data }) => {
  const wordElements = useMemo(() => {
    const maxFrequency = Math.max(...Object.values(data.word_frequencies));
    const words = Object.entries(data.word_frequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 60);

    const colorPalettes = [
      ['#f97316', '#fb923c', '#f59e0b', '#38bdf8', '#e2e8f0'],
      ['#ea580c', '#fdba74', '#d97706', '#cbd5e1', '#fb7185'],
      ['#fb923c', '#fcd34d', '#f97316', '#60a5fa', '#cbd5e1'],
      ['#f59e0b', '#f97316', '#c2410c', '#22d3ee', '#f8fafc'],
      ['#ffedd5', '#fdba74', '#f97316', '#94a3b8', '#334155']
    ];

    const selectedPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

    const getWordSize = (frequency: number): number => {
      const intensity = frequency / maxFrequency;
      const minSize = 14;
      const maxSize = 64;
      return Math.round(minSize + (intensity * (maxSize - minSize)));
    };

    const getWordColor = (frequency: number): string => {
      const intensity = frequency / maxFrequency;

      if (intensity > 0.7) {
        return selectedPalette[0];
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

    const getOrientation = (): 'horizontal' | 'vertical' => {
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

    return words.map(([word, frequency], index) => {
      const size = getWordSize(frequency);
      const orientation = getOrientation();
      const rotation = getRotation(orientation);

      const intensity = frequency / maxFrequency;
      const baseSpeed = 0.3 + (1 - intensity) * 0.7;

      const rotationSpeed = (Math.random() - 0.5) * (0.5 + (1 - intensity) * 1.5);

      return {
        word,
        frequency,
        size,
        color: getWordColor(frequency),
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
    <div className="surface-card surface-card-hover p-6 md:p-8">
      <div className="card-header">
        <div>
          <p className="section-kicker">Resultados</p>
          <h3 className="section-title mt-2">Visualización de la nube</h3>
          <p className="section-copy mt-3">
            Revisa las palabras más frecuentes, alterna el modo animado y analiza la densidad del vocabulario.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-[var(--border-color)] bg-[rgba(249,115,22,0.08)] px-4 py-3 text-right md:block">
          <p className="stat-card__title">Resumen</p>
          <p className="stat-card__value mt-2">{data.unique_words.toLocaleString('es-ES')}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Palabras únicas</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat-card">
          <p className="stat-card__title">Palabras analizadas</p>
          <p className="stat-card__value mt-2 text-[var(--primary-light)]">{data.total_words.toLocaleString('es-ES')}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__title">Palabras únicas</p>
          <p className="stat-card__value mt-2 text-[var(--secondary-color)]">{data.unique_words.toLocaleString('es-ES')}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__title">Densidad de vocabulario</p>
          <p className="stat-card__value mt-2 text-[var(--primary-color)]">
            {Math.round((data.unique_words / data.total_words) * 100)}%
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="wordcloud-canvas relative mt-6 h-96 w-full overflow-hidden rounded-[1.25rem]"
      >
        {animatedElements.map((element) => (
          <div
            key={element.id}
            className="absolute cursor-pointer select-none transition-transform duration-200 hover:z-20 hover:scale-110"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
              fontSize: `${element.size}px`,
              color: element.color,
              fontWeight: element.fontWeight,
              fontFamily: 'var(--font-body)',
              textShadow: '0 2px 10px rgba(2,6,23,0.45)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              zIndex: Math.round(element.frequency),
            }}
            title={`${element.word}: ${element.frequency} ocurrencias`}
          >
            {element.word}
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="stat-card">
          <h4 className="stat-card__title mb-4 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-[var(--primary-color)]" />
            Palabras principales
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(data.top_words).slice(0, 10).map(([word, frequency]) => {
              const percentage = ((frequency / maxFrequency) * 100).toFixed(1);
              return (
                <div key={word} className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[rgba(15,23,42,0.55)] px-3 py-2">
                  <span className="font-medium text-[var(--text-primary)]">{word}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-[rgba(148,163,184,0.18)]">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, background: 'var(--gradient-primary)' }}
                      ></div>
                    </div>
                    <span className="w-9 text-right text-sm text-[var(--text-secondary)]">
                      {frequency}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-[var(--border-color)] pt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Modo de visualización
              </label>
              <div className="toggle-shell">
                <button
                  type="button"
                  onClick={() => setIsAnimationEnabled(false)}
                  className={`toggle-button ${
                    !isAnimationEnabled
                      ? 'toggle-button--active'
                      : 'toggle-button--idle'
                  }`}
                >
                  Estático
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnimationEnabled(true)}
                  className={`toggle-button ${
                    isAnimationEnabled
                      ? 'toggle-button--active'
                      : 'toggle-button--idle'
                  }`}
                >
                  Animado
                </button>
              </div>
              <p className="input-hint">
                {isAnimationEnabled
                  ? 'Las palabras se mueven y rotan continuamente.'
                  : 'Visualización tradicional, sin movimiento.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h4 className="stat-card__title mb-4 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-[var(--secondary-color)]" />
            Estadísticas
          </h4>
          <div className="space-y-3">
            <Tooltip
              content="Número total de palabras analizadas a partir del texto o la URL, incluyendo repeticiones. Representa el volumen completo de contenido procesado."
              position="left"
              delay={400}
            >
              <div className="cursor-help rounded-2xl border border-[var(--border-color)] bg-[rgba(249,115,22,0.08)] px-4 py-3 transition-transform duration-200 hover:scale-[1.02]">
                <div className="text-2xl font-bold text-[var(--primary-light)]">{data.total_words.toLocaleString('es-ES')}</div>
                <div className="text-sm text-[var(--text-secondary)]">Palabras analizadas</div>
              </div>
            </Tooltip>

            <Tooltip
              content="Número de palabras distintas encontradas tras eliminar repeticiones y palabras vacías comunes. Mide la riqueza real del vocabulario."
              position="left"
              delay={400}
            >
              <div className="cursor-help rounded-2xl border border-[var(--border-color)] bg-[rgba(59,130,246,0.08)] px-4 py-3 transition-transform duration-200 hover:scale-[1.02]">
                <div className="text-2xl font-bold text-[var(--primary-light)]">{data.unique_words.toLocaleString('es-ES')}</div>
                <div className="text-sm text-[var(--text-secondary)]">Palabras únicas</div>
              </div>
            </Tooltip>

            <Tooltip
              content="Porcentaje que representa la densidad del vocabulario: (palabras únicas ÷ palabras totales) × 100. Cuanto más alto, más variado es el contenido."
              position="left"
              delay={400}
            >
              <div className="cursor-help rounded-2xl border border-[var(--border-color)] bg-[rgba(245,158,11,0.08)] px-4 py-3 transition-transform duration-200 hover:scale-[1.02]">
                <div className="text-2xl font-bold text-[var(--primary-light)]">{Math.round((data.unique_words / data.total_words) * 100)}%</div>
                <div className="text-sm text-[var(--text-secondary)]">Densidad de vocabulario</div>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCloudVisualization;
