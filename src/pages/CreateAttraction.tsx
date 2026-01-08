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

  const isFormValid = formData.name.trim() && formData.location.trim();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">Nova Atração</h1>
        <p className="text-neutral-600">Adicione um novo ponto de interesse para sua viagem</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-8 shadow-md"
        noValidate
        aria-label="Formulário de criação de atração"
      >
        <fieldset className="space-y-6">
          <legend className="sr-only">Informações da atração</legend>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-semibold text-neutral-900"
            >
              Nome da Atração
              <span aria-label="campo obrigatório" className="ml-1 text-red-600">
                *
              </span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              aria-required="true"
              placeholder="Ex: Grande Muralha da China"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-describedby="name-hint"
            />
            <span id="name-hint" className="sr-only">
              Digite o nome completo da atração turística
            </span>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-semibold text-neutral-900"
            >
              Localização
              <span aria-label="campo obrigatório" className="ml-1 text-red-600">
                *
              </span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              aria-required="true"
              placeholder="Ex: Beijing, China"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-describedby="location-hint"
            />
            <span id="location-hint" className="sr-only">
              Digite a cidade e país da atração
            </span>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-semibold text-neutral-900"
            >
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
              aria-describedby="description-hint"
            />
            <span id="description-hint" className="sr-only">
              Adicione detalhes sobre a atração
            </span>
          </div>

          {/* Rating */}
          <div>
            <label
              htmlFor="rating"
              className="block mb-2 text-sm font-semibold text-neutral-900"
            >
              Avaliação (1-5 estrelas)
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-describedby="rating-hint"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {'⭐'.repeat(star)} {star} estrela{star > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <span id="rating-hint" className="sr-only">
              Selecione uma avaliação de 1 a 5 estrelas
            </span>
          </div>

          {/* Visited Date */}
          <div>
            <label
              htmlFor="visitedDate"
              className="block mb-2 text-sm font-semibold text-neutral-900"
            >
              Data da Visita
            </label>
            <input
              type="date"
              id="visitedDate"
              name="visitedDate"
              value={formData.visitedDate}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-describedby="visitedDate-hint"
            />
            <span id="visitedDate-hint" className="sr-only">
              Selecione a data em que você visitou a atração
            </span>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block mb-2 text-sm font-semibold text-neutral-900"
            >
              Anotações Pessoais
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Adicione observações pessoais..."
              rows={3}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-describedby="notes-hint"
            />
            <span id="notes-hint" className="sr-only">
              Escreva suas impressões pessoais sobre a atração
            </span>
          </div>
        </fieldset>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className="flex-1 rounded-lg bg-primary-600 py-3 font-semibold text-white transition-all hover:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Salvar a nova atração"
          >
            Salvar Atração
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-lg border-2 border-neutral-300 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 active:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400"
            aria-label="Cancelar e voltar para lista de atrações"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
