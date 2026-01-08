import { useState, useCallback } from 'react';
import { cn } from '@/lib/cn';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Buscar atrações...',
  value: controlledValue,
  onChange,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (onChange) {
        onChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    if (onChange) {
      onChange('');
    } else {
      setInternalValue('');
    }
  }, [onChange]);

  return (
    <div className={cn('relative', className)}>
      {/* Search Icon */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-10 py-2.5',
          'bg-white border border-neutral-200 rounded-lg',
          'text-sm font-body text-neutral-800',
          'placeholder:text-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500',
          'transition-colors duration-200'
        )}
        aria-label={placeholder}
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'p-1 rounded-full',
            'text-neutral-400 hover:text-neutral-600',
            'hover:bg-neutral-100',
            'transition-colors duration-200'
          )}
          aria-label="Limpar busca"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
