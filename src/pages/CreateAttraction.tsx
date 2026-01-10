import { useNavigate } from 'react-router-dom';
import AttractionForm, { type AttractionFormValues } from '@/components/AttractionForm';

export default function CreateAttraction() {
  const navigate = useNavigate();

  const handleSave = (_values: AttractionFormValues) => {
    // TODO: Implement backend save functionality
    // For now, navigate back to home
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
