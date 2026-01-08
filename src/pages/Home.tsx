import { Link } from 'react-router-dom';
import { designTokens } from '@/lib/design-tokens';

interface Attraction {
  id: number;
  name: string;
  location: string;
}

const MOCK_ATTRACTIONS: Attraction[] = [
  { id: 1, name: 'Grande Muralha da China', location: 'Beijing' },
  { id: 2, name: 'Cidade Proibida', location: 'Beijing' },
  { id: 3, name: 'Terra Roxa', location: 'Xi\'an' },
];

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-neutral-900">
            Minhas Atrações
          </h2>
          <p className="text-neutral-600">
            Gerencie seus pontos de interesse de viagem
          </p>
        </div>

        <Link
          to="/nova"
          className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: designTokens.colors.primary[600] }}
        >
          + Nova Atração
        </Link>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_ATTRACTIONS.map((attraction) => (
          <Link
            key={attraction.id}
            to={`/atração/${attraction.id}`}
            className="group overflow-hidden rounded-lg border border-neutral-200 shadow-md transition-all hover:border-neutral-300 hover:shadow-xl"
          >
            <div
              className="flex items-center justify-center h-48 font-semibold text-white"
              style={{ background: designTokens.gradients.primary }}
            >
              <span className="px-4 text-center">{attraction.name}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                {attraction.name}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">{attraction.location}</p>
            </div>
          </Link>
        ))}
      </div>

      {MOCK_ATTRACTIONS.length === 0 && (
        <div className="py-12 text-center">
          <p className="mb-4 text-neutral-600">Nenhuma atração registrada ainda</p>
          <Link
            to="/nova"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: designTokens.colors.primary[600] }}
          >
            Criar Primeira Atração
          </Link>
        </div>
      )}
    </div>
  );
}
