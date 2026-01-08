import { Link } from 'react-router-dom';
import { designTokens } from '@/lib/design-tokens';

interface MenuItem {
  label: string;
  href: string;
  icon: string;
  description: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Minhas Atrações',
    href: '/',
    icon: '📍',
    description: 'Veja todas as suas atrações salvas',
  },
  {
    label: 'Nova Atração',
    href: '/nova',
    icon: '➕',
    description: 'Adicione uma nova atração',
  },
  {
    label: 'Configurações',
    href: '#',
    icon: '⚙️',
    description: 'Ajuste suas preferências',
  },
  {
    label: 'Sobre',
    href: '#',
    icon: 'ℹ️',
    description: 'Informações sobre o app',
  },
  {
    label: 'Ajuda',
    href: '#',
    icon: '❓',
    description: 'Central de ajuda',
  },
];

export default function Menu() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold text-neutral-900">Menu</h1>
      <p className="mb-8 text-neutral-600">Navegue pelas funcionalidades do Pinpoint 🇨🇳</p>

      <nav
        className="space-y-3"
        aria-label="Funcionalidades principais"
        role="navigation"
      >
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            aria-label={`${item.label}: ${item.description}`}
            className="group flex items-center gap-4 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-primary-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
          >
            <div className="text-3xl flex-shrink-0" aria-hidden="true">{item.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                {item.label}
              </h3>
              <p className="text-sm text-neutral-600">{item.description}</p>
            </div>
            <svg
              className="w-5 h-5 text-neutral-400 transition-colors group-hover:text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </nav>

      {/* App Info Section */}
      <section
        className="mt-12 rounded-lg p-6"
        style={{ backgroundColor: designTokens.colors.primary[50] }}
        aria-label="Informações sobre o Pinpoint"
        role="region"
      >
        <h2 className="mb-2 font-semibold text-neutral-900">Sobre Pinpoint 🇨🇳</h2>
        <p className="text-sm leading-relaxed text-neutral-700">
          Pinpoint é sua aplicação perfeita para organizar e gerenciar pontos de interesse durante
          suas viagens. Salve atrações, avalie-as, e mantenha suas memórias de viagem organizadas!
        </p>
        <p className="mt-4 text-xs text-neutral-600">Versão 1.0.0</p>
      </section>
    </div>
  );
}
