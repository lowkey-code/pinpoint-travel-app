import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailView, { type AttractionDetailData } from '@/components/DetailView';
import { Button } from '@/components/ui';

const MOCK_ATTRACTIONS: AttractionDetailData[] = [
  {
    id: '1',
    name: 'Grande Muralha da China',
    chineseAddress: '北京市怀柔区慕田峪长城',
    coordinates: { latitude: 40.43191, longitude: 116.57037 },
    category: 'monument',
    notes: 'Chegue cedo para pegar pouca fila e melhor luz para fotos.',
    visited: true,
  },
  {
    id: '2',
    name: 'Cidade Proibida',
    chineseAddress: '北京市东城区景山前街4号',
    coordinates: { latitude: 39.91635, longitude: 116.39715 },
    category: 'museum',
    notes: 'Reserve pelo menos meio dia para explorar com calma.',
    visited: false,
  },
  {
    id: '3',
    name: 'Terra Roxa',
    chineseAddress: '陕西省西安市临潼区秦始皇陵东侧',
    coordinates: { latitude: 34.3853, longitude: 109.2732 },
    category: 'monument',
    notes: 'Leve água e prepare-se para caminhar bastante.',
    visited: false,
  },
];

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const attraction = MOCK_ATTRACTIONS.find((item) => item.id === id);

  const [isVisited, setIsVisited] = useState(attraction?.visited ?? false);
  const [statusMessage, setStatusMessage] = useState('');
  const statusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!attraction) {
      return;
    }
    setIsVisited(attraction.visited);
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
      pushStatusMessage(
        nextValue ? 'Marcada como visitada.' : 'Marcada como não visitada.'
      );
    },
    [pushStatusMessage]
  );

  const handleCopyAddress = useCallback(async () => {
    if (!attraction) {
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard not supported');
      }
      await navigator.clipboard.writeText(attraction.chineseAddress);
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
      : attraction.chineseAddress;
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
    navigate('/');
  }, [attraction, navigate]);

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
