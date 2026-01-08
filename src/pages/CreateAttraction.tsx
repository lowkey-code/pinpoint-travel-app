import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  location: string;
  description: string;
  rating: number;
  visitedDate: string;
  notes: string;
}

export default function CreateAttraction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    description: '',
    rating: 5,
    visitedDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Save to backend
    console.log('Form data:', formData);
    navigate('/');
  };

  const handleCancel = () => navigate('/');

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">Nova Atração</h1>
        <p className="text-neutral-600">Adicione um novo ponto de interesse para sua viagem</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-md">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-semibold text-neutral-900">
            Nome da Atração *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Ex: Grande Muralha da China"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block mb-2 text-sm font-semibold text-neutral-900">
            Localização *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            placeholder="Ex: Beijing, China"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-semibold text-neutral-900">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descreva a atração..."
            rows={4}
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block mb-2 text-sm font-semibold text-neutral-900">
            Avaliação (1-5 estrelas)
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          <label htmlFor="visitedDate" className="block mb-2 text-sm font-semibold text-neutral-900">
            Data da Visita
          </label>
          <input
            type="date"
            id="visitedDate"
            name="visitedDate"
            value={formData.visitedDate}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block mb-2 text-sm font-semibold text-neutral-900">
            Anotações
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Adicione observações pessoais..."
            rows={3}
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-primary-600 py-3 font-semibold text-white transition-all hover:bg-primary-700 active:bg-primary-800"
          >
            Salvar Atração
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-lg border-2 border-neutral-300 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 active:bg-neutral-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
