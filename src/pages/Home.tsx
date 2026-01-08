import { Link } from 'react-router-dom';

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
  const attractionCount = MOCK_ATTRACTIONS.length;

  return (
    <div>
      {/* Page Header */}
      <section className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">
            Minhas Atrações
          </h1>
          <p className="text-neutral-600">
            Gerencie seus {attractionCount} ponto{attractionCount !== 1 ? 's' : ''} de interesse de viagem
          </p>
        </div>

        <Link
          to="/nova"
          className="px-6 py-3 rounded-lg font-semibold text-white bg-primary-600 transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 active:bg-primary-800"
          aria-label="Criar nova atração"
        >
          + Nova Atração
        </Link>
      </section>

      {/* Attractions Grid */}
      {attractionCount > 0 ? (
        <section
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Lista de atrações"
        >
          {MOCK_ATTRACTIONS.map((attraction) => (
            <article
              key={attraction.id}
              className="group overflow-hidden rounded-lg border border-neutral-200 shadow-md transition-all hover:border-neutral-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary-600"
            >
              <Link
                to={`/atração/${attraction.id}`}
                className="block focus:outline-none"
                aria-label={`${attraction.name} em ${attraction.location}`}
              >
                <div
                  className="flex items-center justify-center h-48 font-semibold text-white bg-gradient-primary"
                  role="img"
                  aria-label={`Imagem da atração: ${attraction.name}`}
                >
                  <span className="px-4 text-center">{attraction.name}</span>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                    {attraction.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    <span className="sr-only">Localização: </span>
                    {attraction.location}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="py-12 text-center" aria-label="Estado vazio">
          <p className="mb-4 text-neutral-600">Nenhuma atração registrada ainda</p>
          <Link
            to="/nova"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white bg-primary-600 transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 active:bg-primary-800"
            aria-label="Criar sua primeira atração"
          >
            Criar Primeira Atração
          </Link>
        </section>
      )}
    </div>
  );
}
