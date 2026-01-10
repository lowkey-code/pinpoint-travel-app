import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailView, { type AttractionDetailData } from '@/components/DetailView';
import { Button } from '@/components/ui';
import { useAttractions } from '@/context/AttractionsContext';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAttractionById, deleteAttraction, updateAttraction } = useAttractions();
  const attraction = useMemo(
    () => (id ? getAttractionById(id) : undefined),
    [getAttractionById, id]
  );

  const detailAttraction = useMemo<AttractionDetailData | null>(() => {
    if (!attraction) {
      return null;
    }
    return {
      id: attraction.id,
      name: attraction.name,
      address: attraction.address,
      coordinates: attraction.coordinates,
      category: attraction.category,
      notes: attraction.notes,
      visited: attraction.visited ?? false,
    };
  }, [attraction]);

  const [isVisited, setIsVisited] = useState(attraction?.visited ?? false);
  const [statusMessage, setStatusMessage] = useState('');
  const statusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!detailAttraction) {
      return;
    }
    setIsVisited(detailAttraction.visited);
    setStatusMessage('');
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }
  }, [detailAttraction]);

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        window.clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  const pushStatusMessage = useCallback((message: string) => {
    setStatusMessage(message);
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = window.setTimeout(() => {
      setStatusMessage('');
      statusTimeoutRef.current = null;
    }, 2500);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleVisitedChange = useCallback(
    (nextValue: boolean) => {
      setIsVisited(nextValue);
      if (detailAttraction) {
        updateAttraction(detailAttraction.id, { visited: nextValue });
      }
      pushStatusMessage(
        nextValue ? 'Marcada como visitada.' : 'Marcada como não visitada.'
      );
    },
    [detailAttraction, pushStatusMessage, updateAttraction]
  );

  const handleCopyAddress = useCallback(async () => {
    if (!detailAttraction) {
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard not supported');
      }
      await navigator.clipboard.writeText(detailAttraction.address);
      pushStatusMessage('Endereço copiado para a área de transferência.');
    } catch {
      pushStatusMessage('Não foi possível copiar o endereço.');
    }
  }, [detailAttraction, pushStatusMessage]);

  const handleOpenMap = useCallback(() => {
    if (!detailAttraction) {
      return;
    }
    const query = detailAttraction.coordinates
      ? `${detailAttraction.coordinates.latitude},${detailAttraction.coordinates.longitude}`
      : detailAttraction.address;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
    pushStatusMessage('Abrindo mapa...');
  }, [detailAttraction, pushStatusMessage]);

  const handleEdit = useCallback(() => {
    if (!detailAttraction) {
      return;
    }
    navigate(`/attraction/${detailAttraction.id}/edit`);
  }, [detailAttraction, navigate]);

  const handleDelete = useCallback(() => {
    if (!detailAttraction) {
      return;
    }
    const confirmed = window.confirm(
      `Tem certeza que deseja deletar "${detailAttraction.name}"?`
    );
    if (!confirmed) {
      return;
    }
    deleteAttraction(detailAttraction.id);
    navigate('/');
  }, [deleteAttraction, detailAttraction, navigate]);

  if (!detailAttraction) {
    return (
      <div className="flex flex-col gap-4 py-12">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">
          Atração não encontrada
        </h1>
        <p className="text-neutral-600">
          Verifique o link ou volte para a lista de atrações.
        </p>
      </div>
    );
  }

  return (
    <DetailView
      attraction={detailAttraction}
      isVisited={isVisited}
      statusMessage={statusMessage}
      onBack={handleBack}
      onCopyAddress={handleCopyAddress}
      onOpenMap={handleOpenMap}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onVisitedChange={handleVisitedChange}
    />
  );
}
