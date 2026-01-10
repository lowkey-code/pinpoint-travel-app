import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, IconButton, useToast } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { Attraction } from '@/types/attraction';

interface AttractionCardProps {
  attraction: Attraction;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  monument: 'Monumento',
  museum: 'Museu',
  restaurant: 'Restaurante',
  temple: 'Templo',
  hotel: 'Hotel',
  shopping: 'Shopping',
  other: 'Outro',
};

export function AttractionCard({ attraction, className }: AttractionCardProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCardClick = useCallback(() => {
    navigate(`/attraction/${attraction.id}`);
  }, [attraction.id, navigate]);

  const handleCardKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigate(`/attraction/${attraction.id}`);
      }
    },
    [attraction.id, navigate]
  );

  const handleCopyAddress = useCallback(async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(attraction.address);
      showToast('Endereço copiado!', 'success');
    } catch {
      showToast('Erro ao copiar endereço', 'error');
    }
  }, [attraction.address, showToast]);

  const handleOpenMaps = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    const { latitude, longitude } = attraction.coordinates;
    // Try to detect platform and open appropriate maps app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    let url: string;
    if (isIOS) {
      // Apple Maps
      url = `maps://maps.apple.com/?q=${encodeURIComponent(attraction.name)}&ll=${latitude},${longitude}`;
    } else {
      // Google Maps (works on Android and web)
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }, [attraction]);

  return (
    <Card
      variant="default"
      className={cn('flex flex-col gap-3', className)}
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      {/* Header: Name and Badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold font-heading text-neutral-900 leading-tight">
          {attraction.name}
        </h3>
        <Badge category={attraction.category} size="sm">
          {categoryLabels[attraction.category]}
        </Badge>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 mt-0.5 text-neutral-400">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </span>
        <p className="text-sm text-neutral-600 font-body leading-relaxed">
          {attraction.address}
        </p>
      </div>

      {/* Notes (if any) */}
      {attraction.notes && (
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 mt-0.5 text-neutral-400">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </span>
          <p className="text-sm text-neutral-500 font-body italic">
            {attraction.notes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
        <IconButton
          aria-label="Copiar endereço"
          variant="ghost"
          size="sm"
          onClick={handleCopyAddress}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </IconButton>
        <IconButton
          aria-label="Abrir no mapa"
          variant="primary"
          size="sm"
          onClick={handleOpenMaps}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </IconButton>
      </div>
    </Card>
  );
}
