import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme/tokens';

export default function CreateAttraction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    rating: 5,
    visitedDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    console.log('Form data:', formData);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Nova Atração</h1>
        <p className="text-neutral-600">Adicione um novo ponto de interesse para sua viagem</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2">
            Nome da Atração *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ex: Grande Muralha da China"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-neutral-900 mb-2">
            Localização *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Ex: Beijing, China"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-neutral-900 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva a atração..."
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block text-sm font-semibold text-neutral-900 mb-2">
            Avaliação (1-5 estrelas)
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {'⭐'.repeat(star)} {star} estrela{star > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Visited Date */}
        <div>
          <label htmlFor="visitedDate" className="block text-sm font-semibold text-neutral-900 mb-2">
            Data da Visita
          </label>
          <input
            type="date"
            id="visitedDate"
            name="visitedDate"
            value={formData.visitedDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-neutral-900 mb-2">
            Anotações
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Adicione observações pessoais..."
            rows={3}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: tokens.colors.primary[600] }}
          >
            Salvar Atração
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-lg border-2 font-semibold transition-colors"
            style={{
              borderColor: tokens.colors.neutral[300],
              color: tokens.colors.neutral[700],
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = tokens.colors.neutral[100];
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
