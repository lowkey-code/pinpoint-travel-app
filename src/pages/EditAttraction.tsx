import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AttractionForm, { type AttractionFormValues } from '@/components/AttractionForm';
import { Button } from '@/components/ui';
import { mockAttractions } from '@/data/attractions';

export default function EditAttraction() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const attraction = useMemo(
    () => mockAttractions.find((item) => item.id === id),
    [id]
  );

  const handleSave = (_values: AttractionFormValues) => {
    // TODO: Implement backend update functionality
    if (id) {
      navigate(`/attraction/${id}`);
      return;
    }
    navigate('/');
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/attraction/${id}`);
      return;
    }
    navigate('/');
  };

  if (!attraction) {
    return (
      <div className="flex flex-col gap-4 py-12">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
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
    <AttractionForm
      title="Editar Atração"
      submitLabel="Salvar alterações"
      initialValues={{
        name: attraction.name,
        chineseAddress: attraction.address,
        coordinates: attraction.coordinates,
        category: attraction.category,
        notes: attraction.notes,
      }}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
