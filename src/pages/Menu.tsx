import { Link } from 'react-router-dom';
import { tokens } from '../theme/tokens';

export default function Menu() {
  const menuItems = [
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">Menu</h1>
      <p className="text-neutral-600 mb-8">Navegue pelas funcionalidades do Pinpoint 🇨🇳</p>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-neutral-50 transition-colors group"
          >
            <div className="text-3xl flex-shrink-0">{item.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                {item.label}
              </h3>
              <p className="text-sm text-neutral-600">{item.description}</p>
            </div>
            <svg
              className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* App Info Section */}
      <div
        className="mt-12 p-6 rounded-lg"
        style={{ backgroundColor: tokens.colors.primary[50] }}
      >
        <h2 className="font-semibold text-neutral-900 mb-2">Sobre Pinpoint 🇨🇳</h2>
        <p className="text-sm text-neutral-700 leading-relaxed">
          Pinpoint é sua aplicação perfeita para organizar e gerenciar pontos de interesse durante
          suas viagens. Salve atrações, avalie-as, e mantenha suas memorias de viagem organizadas!
        </p>
        <p className="text-xs text-neutral-600 mt-4">Versão 1.0.0</p>
      </div>
    </div>
  );
}
