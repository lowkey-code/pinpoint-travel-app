import { Link } from 'react-router-dom';
import { tokens } from '../theme/tokens';

export default function Home() {
  // Mock data - será substituído por dados reais
  const attractions = [
    { id: 1, name: 'Grande Muralha da China', location: 'Beijing' },
    { id: 2, name: 'Cidade Proibida', location: 'Beijing' },
    { id: 3, name: 'Terra Roxa', location: 'Xi\'an' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Minhas Atrações
          </h2>
          <p className="text-neutral-600">
            Gerencie seus pontos de interesse de viagem
          </p>
        </div>

        <Link
          to="/nova"
          className="px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: tokens.colors.primary[600] }}
        >
          + Nova Atração
        </Link>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attractions.map((attraction) => (
          <Link
            key={attraction.id}
            to={`/atração/${attraction.id}`}
            className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border border-neutral-200 hover:border-neutral-300 cursor-pointer"
          >
            <div
              className="h-48 bg-gradient-to-br flex items-center justify-center text-white font-semibold"
              style={{ background: tokens.colors.gradient.blue }}
            >
              <span className="text-center px-4">{attraction.name}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                {attraction.name}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">{attraction.location}</p>
            </div>
          </Link>
        ))}
      </div>

      {attractions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-4">Nenhuma atração registrada ainda</p>
          <Link
            to="/nova"
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: tokens.colors.primary[600] }}
          >
            Criar Primeira Atração
          </Link>
        </div>
      )}
    </div>
  );
}
