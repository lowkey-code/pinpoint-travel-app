import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data
  const attraction = {
    id: id || '1',
    name: 'Grande Muralha da China',
    location: 'Beijing, China',
    description:
      'A Grande Muralha da China é uma série de fortificações construídas ao longo das bordas históricas do norte da China.',
    rating: 4.8,
    reviews: 1234,
    visitedDate: '2024-05-15',
    notes: 'Vista espetacular, muito bem preservada.',
  };

  const handleGoBack = () => navigate(-1);
  const ratingPercentage = (attraction.rating / 5) * 100;

  return (
    <article>
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 mb-6 font-semibold text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 rounded-lg transition-colors"
        type="button"
        aria-label="Voltar para página anterior"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      {/* Hero Section */}
      <div className="mb-8 flex items-center justify-center rounded-lg h-64 shadow-lg bg-gradient-to-r from-primary-700 to-primary-500">
        <h1 className="px-4 text-4xl font-bold text-center text-white">
          {attraction.name}
        </h1>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content */}
        <section className="lg:col-span-2">
          {/* Location */}
          <div className="mb-8" role="region" aria-labelledby="location-heading">
            <h2 className="mb-2 text-xl font-semibold text-neutral-900" id="location-heading">
              Localização
            </h2>
            <p className="flex items-center gap-2 text-neutral-600">
              <svg
                className="w-5 h-5 flex-shrink-0"
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
              <span>{attraction.location}</span>
            </p>
          </div>

          {/* Description */}
          <div className="mb-8" role="region" aria-labelledby="description-heading">
            <h2 className="mb-3 text-xl font-semibold text-neutral-900" id="description-heading">
              Descrição
            </h2>
            <p className="leading-relaxed text-neutral-700">{attraction.description}</p>
          </div>

          {/* Rating */}
          <div className="mb-8" role="region" aria-labelledby="rating-heading">
            <h2 className="mb-3 text-xl font-semibold text-neutral-900" id="rating-heading">
              Avaliação
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1" aria-label={`Avaliação: ${attraction.rating} de 5 estrelas`}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < Math.floor(attraction.rating)
                        ? 'fill-amber-400 stroke-amber-400'
                        : 'fill-none stroke-neutral-300'
                    )}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                ))}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold" aria-live="polite">
                  {attraction.rating}
                </span>
                <span className="text-sm text-neutral-600">
                  ({attraction.reviews} avaliação{attraction.reviews !== 1 ? 'ões' : ''})
                </span>
              </div>
              <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${ratingPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={ratingPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Barra de avaliação"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8" role="region" aria-labelledby="notes-heading">
            <h2 className="mb-3 text-xl font-semibold text-neutral-900" id="notes-heading">
              Anotações
            </h2>
            <p className="italic text-neutral-700">{attraction.notes}</p>
          </div>
        </section>

        {/* Sidebar */}
        <aside aria-label="Informações adicionais">
          {/* Visited Date Card */}
          <div className="mb-6 rounded-lg bg-primary-50 p-6">
            <h3 className="mb-2 font-semibold text-neutral-900">Data da Visita</h3>
            <time className="mb-4 font-semibold text-primary-600" dateTime={attraction.visitedDate}>
              {new Date(attraction.visitedDate).toLocaleDateString('pt-BR')}
            </time>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white transition-all hover:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600"
              type="button"
              aria-label="Editar atração"
            >
              Editar
            </button>

            <button
              className="w-full rounded-lg border-2 border-red-500 py-3 font-semibold text-red-500 transition-colors hover:bg-red-50 active:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              type="button"
              aria-label="Deletar atração"
            >
              Deletar
            </button>
          </div>
        </aside>
      </div>
    </article>
  );
}
