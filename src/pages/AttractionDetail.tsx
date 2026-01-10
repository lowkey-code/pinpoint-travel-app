import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailView from '@/components/DetailView';
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

  const [isVisited, setIsVisited] = useState(attraction?.visited ?? false);
  const [statusMessage, setStatusMessage] = useState('');
  const statusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!attraction) {
      return;
    }
    setIsVisited(attraction.visited ?? false);
    setStatusMessage('');
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }
  }, [attraction]);

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
      if (attraction) {
        updateAttraction(attraction.id, { visited: nextValue });
      }
      pushStatusMessage(
        nextValue ? 'Marcada como visitada.' : 'Marcada como não visitada.'
      );
    },
    [attraction, pushStatusMessage, updateAttraction]
  );

  const handleCopyAddress = useCallback(async () => {
    if (!attraction) {
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard not supported');
      }
      await navigator.clipboard.writeText(attraction.address);
      pushStatusMessage('Endereço copiado para a área de transferência.');
    } catch {
      pushStatusMessage('Não foi possível copiar o endereço.');
    }
  }, [attraction, pushStatusMessage]);

  const handleOpenMap = useCallback(() => {
    if (!attraction) {
      return;
    }
    const query = attraction.coordinates
      ? `${attraction.coordinates.latitude},${attraction.coordinates.longitude}`
      : attraction.address;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
    pushStatusMessage('Abrindo mapa...');
  }, [attraction, pushStatusMessage]);

  const handleEdit = useCallback(() => {
    if (!attraction) {
      return;
    }
    navigate(`/attraction/${attraction.id}/edit`);
  }, [attraction, navigate]);

  const handleDelete = useCallback(() => {
    if (!attraction) {
      return;
    }
    const confirmed = window.confirm(
      `Tem certeza que deseja deletar "${attraction.name}"?`
    );
    if (!confirmed) {
      return;
    }
    deleteAttraction(attraction.id);
    navigate('/');
  }, [attraction, deleteAttraction, navigate]);

  if (!attraction) {
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
      attraction={attraction}
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
