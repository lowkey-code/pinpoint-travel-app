import { useNavigate } from 'react-router-dom';
import AttractionForm, { type AttractionFormValues } from '@/components/AttractionForm';
import { useAttractions } from '@/context/AttractionsContext';

export default function CreateAttraction() {
  const navigate = useNavigate();
  const { createAttraction } = useAttractions();

  const handleSave = (values: AttractionFormValues) => {
    createAttraction({
      name: values.name,
      address: values.chineseAddress,
      coordinates: values.coordinates,
      category: values.category,
      notes: values.notes,
      visited: false,
    });
    navigate('/');
  };

  const handleCancel = () => navigate('/');

  return (
    <AttractionForm
      title="Nova Atração"
      submitLabel="Salvar atração"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
