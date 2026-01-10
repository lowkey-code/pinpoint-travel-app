import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { AttractionCard } from '@/components/AttractionCard';
import { useAttractions } from '@/context/AttractionsContext';

export default function Attractions() {
  const [searchQuery, setSearchQuery] = useState('');
  const { attractions } = useAttractions();

  const filteredAttractions = useMemo(() => {
    if (!searchQuery.trim()) {
      return attractions;
    }

    const query = searchQuery.toLowerCase();
    return attractions.filter(
      (attraction) =>
        attraction.name.toLowerCase().includes(query) ||
        attraction.address.toLowerCase().includes(query) ||
        attraction.notes?.toLowerCase().includes(query)
    );
  }, [attractions, searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-120px)]">
      {/* Header with Search */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-heading text-neutral-900">
            Atrações
          </h1>
          <span className="text-sm text-neutral-500">
            {filteredAttractions.length} encontradas
          </span>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por nome, endereço ou notas..."
        />
      </header>

      {/* Attractions List */}
      <section aria-label="Lista de atrações">
        {filteredAttractions.length > 0 ? (
          <div className="flex flex-col gap-4 pb-20">
            {filteredAttractions.map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold font-heading text-neutral-900 mb-2">
              Nenhuma atração encontrada
            </h2>
            <p className="text-sm text-neutral-500 max-w-xs">
              Tente buscar por outro termo ou adicione uma nova atração.
            </p>
          </div>
        )}
      </section>

      {/* FAB - Floating Action Button */}
      <Link
        to="/nova"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2"
        aria-label="Adicionar nova atração"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Link>
    </div>
  );
}
