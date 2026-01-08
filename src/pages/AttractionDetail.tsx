import { useParams, useNavigate } from 'react-router-dom';
import { designTokens } from '@/lib/design-tokens';

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

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 mb-6 font-semibold text-primary-600 hover:text-primary-700"
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      {/* Hero Section */}
      <div
        className="mb-8 flex items-center justify-center rounded-lg h-64 shadow-lg"
        style={{ background: designTokens.gradients.primary }}
      >
        <h1 className="px-4 text-4xl font-bold text-center text-white">
          {attraction.name}
        </h1>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Location */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold text-neutral-900">Localização</h2>
            <p className="flex items-center gap-2 text-neutral-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {attraction.location}
            </p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-neutral-900">Descrição</h2>
            <p className="leading-relaxed text-neutral-700">{attraction.description}</p>
          </div>

          {/* Rating */}
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-neutral-900">Avaliação</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill={i < Math.floor(attraction.rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      color: i < Math.floor(attraction.rating)
                        ? designTokens.colors.warning
                        : designTokens.colors.neutral[300],
                    }}
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
              <span className="font-semibold">{attraction.rating}</span>
              <span className="text-neutral-600">({attraction.reviews} avaliações)</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-neutral-900">Anotações</h2>
            <p className="italic text-neutral-700">{attraction.notes}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Visited Date Card */}
          <div
            className="mb-6 rounded-lg p-6"
            style={{ backgroundColor: designTokens.colors.primary[50] }}
          >
            <h3 className="mb-2 font-semibold text-neutral-900">Data da Visita</h3>
            <p className="font-semibold text-primary-600 mb-4">
              {new Date(attraction.visitedDate).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full rounded-lg py-3 font-semibold text-white transition-colors"
              style={{
                backgroundColor: designTokens.colors.primary[600],
              }}
              type="button"
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  designTokens.colors.primary[700];
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  designTokens.colors.primary[600];
              }}
            >
              Editar
            </button>

            <button
              className="w-full rounded-lg border-2 py-3 font-semibold transition-colors"
              style={{
                borderColor: designTokens.colors.error,
                color: designTokens.colors.error,
              }}
              type="button"
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  designTokens.colors.neutral[50];
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
