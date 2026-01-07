import { useParams, useNavigate } from 'react-router-dom';
import { tokens } from '../theme/tokens';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data - será substituído por dados reais
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

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      {/* Hero Section */}
      <div
        className="h-64 rounded-lg shadow-lg mb-8 flex items-center justify-center"
        style={{ background: tokens.colors.gradient.blue }}
      >
        <h1 className="text-4xl font-bold text-white text-center px-4">
          {attraction.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Location */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Localização</h2>
            <p className="text-neutral-600 flex items-center gap-2">
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
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">Descrição</h2>
            <p className="text-neutral-700 leading-relaxed">{attraction.description}</p>
          </div>

          {/* Rating */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">Avaliação</h2>
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
                      color: i < Math.floor(attraction.rating) ? tokens.colors.warning : tokens.colors.neutral[300],
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
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">Anotações</h2>
            <p className="text-neutral-700 italic">{attraction.notes}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Visited Date Card */}
          <div
            className="p-6 rounded-lg mb-6"
            style={{ backgroundColor: tokens.colors.primary[50] }}
          >
            <h3 className="font-semibold text-neutral-900 mb-2">Data da Visita</h3>
            <p className="text-primary-600 font-semibold mb-4">
              {new Date(attraction.visitedDate).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full py-3 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: tokens.colors.primary[600],
                color: 'white',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = tokens.colors.primary[700];
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = tokens.colors.primary[600];
              }}
            >
              Editar
            </button>

            <button
              className="w-full py-3 rounded-lg font-semibold border-2 transition-colors"
              style={{
                borderColor: tokens.colors.error,
                color: tokens.colors.error,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = tokens.colors.neutral[50];
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
