import { Badge, Button, Card, type BadgeCategory } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AttractionDetailData {
  id: string;
  name: string;
  address: string;
  coordinates?: Coordinates;
  category: BadgeCategory;
  notes?: string;
  visited: boolean;
}

interface DetailViewProps {
  attraction: AttractionDetailData;
  isVisited: boolean;
  statusMessage?: string;
  onBack: () => void;
  onCopyAddress: () => void;
  onOpenMap: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onVisitedChange: (nextValue: boolean) => void;
}

const CATEGORY_LABELS: Record<BadgeCategory, string> = {
  monument: 'Monumento',
  museum: 'Museu',
  restaurant: 'Restaurante',
  temple: 'Templo',
  hotel: 'Hotel',
  shopping: 'Compras',
  other: 'Outro',
};

const icons = {
  back: (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  copy: (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-8a2 2 0 01-2-2V7z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 9H5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1"
      />
    </svg>
  ),
  map: (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5-2V5l5 2 6-2 5 2v13l-5-2-6 2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7v13" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v13" />
    </svg>
  ),
  edit: (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 4h7a2 2 0 012 2v7M16 3l5 5M4 20l4.5-1.5L19 8l-4-4L4.5 14.5 3 19.5 4 20z"
      />
    </svg>
  ),
  trash: (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
      />
    </svg>
  ),
};

function formatCoordinate(value?: number) {
  if (value === undefined) {
    return 'Não informado';
  }
  return value.toFixed(5);
}

export default function DetailView({
  attraction,
  isVisited,
  statusMessage,
  onBack,
  onCopyAddress,
  onOpenMap,
  onEdit,
  onDelete,
  onVisitedChange,
}: DetailViewProps) {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-neutral-200">
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={icons.back}
            onClick={onBack}
          >
            Voltar
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-neutral-900">
              {attraction.name}
            </h1>
            <Badge category={attraction.category} size="md">
              {CATEGORY_LABELS[attraction.category]}
            </Badge>
          </div>
        </div>

        <label
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md border text-sm font-medium',
            isVisited
              ? 'border-secondary-200 bg-secondary-50 text-secondary-700'
              : 'border-neutral-200 bg-white text-neutral-700'
          )}
        >
          <input
            type="checkbox"
            checked={isVisited}
            onChange={(event) => onVisitedChange(event.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-200"
          />
          Marcar como visitado
        </label>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="flex flex-col lg:col-span-2 gap-6">
          <Card variant="elevated" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Endereço em chinês
              </p>
              <p className="mt-2 px-4 py-3 rounded-md bg-accent-50 text-2xl font-semibold font-heading text-neutral-900">
                {attraction.address}
              </p>
            </div>

            <dl className="grid gap-3 px-4 py-3 rounded-md bg-neutral-50 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-neutral-600">Latitude</dt>
                <dd className="font-mono text-neutral-900">
                  {formatCoordinate(attraction.coordinates?.latitude)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-600">Longitude</dt>
                <dd className="font-mono text-neutral-900">
                  {formatCoordinate(attraction.coordinates?.longitude)}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" leftIcon={icons.copy} onClick={onCopyAddress}>
                Copiar endereço
              </Button>
              <Button variant="secondary" leftIcon={icons.map} onClick={onOpenMap}>
                Abrir mapa
              </Button>
            </div>

            {statusMessage && (
              <p className="text-sm text-secondary-700" role="status" aria-live="polite">
                {statusMessage}
              </p>
            )}
          </Card>

          <Card variant="default" className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-900">Notas</h2>
            <p className="text-neutral-700">
              {attraction.notes ?? 'Sem notas adicionadas.'}
            </p>
          </Card>
        </section>

        <aside className="flex flex-col gap-6">
          <Card variant="default" className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-neutral-900">Ações</h2>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" leftIcon={icons.edit} onClick={onEdit} fullWidth>
                Editar
              </Button>
              <Button
                variant="secondary"
                leftIcon={icons.trash}
                onClick={onDelete}
                fullWidth
                className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 focus-visible:ring-red-200"
              >
                Deletar
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </article>
  );
}
