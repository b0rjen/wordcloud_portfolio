import { useState, useRef, type FC, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-3';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-3';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-3';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-3';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-3';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-8 border-l-8 border-r-8 border-t-[var(--bg-secondary)] border-l-transparent border-r-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-8 border-l-8 border-r-8 border-b-[var(--bg-secondary)] border-l-transparent border-r-transparent';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-8 border-t-8 border-b-8 border-l-[var(--bg-secondary)] border-t-transparent border-b-transparent';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-8 border-t-8 border-b-8 border-r-[var(--bg-secondary)] border-t-transparent border-b-transparent';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-8 border-l-8 border-r-8 border-t-[var(--bg-secondary)] border-l-transparent border-r-transparent';
    }
  };

  return (
    <div
      className="relative inline-block w-full"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}

      {isVisible && (
        <div className="absolute z-50 pointer-events-none">
          <div
            className={`max-w-xs whitespace-normal rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] shadow-2xl shadow-black/40 transform transition-all duration-200 ease-out ${getPositionClasses()}`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            {content}

            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 ${getArrowClasses()}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
