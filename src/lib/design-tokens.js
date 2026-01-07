export const designTokens = {
  colors: {
    // Primary - Azul profundo e confiável (remete a viagem/navegação)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Principal
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Secondary - Verde menta (sucesso, completado, positivo)
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Principal
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    // Accent - Âmbar quente (destaque, ação, atenção)
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Principal
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    // Neutral - Cinzas para textos e backgrounds
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },

    // Semânticas
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  fonts: {
    // Títulos e Headers - Moderna, geométrica, impactante
    heading: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",

    // Corpo de texto - Legível, neutra, profissional
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // Monospace - Códigos, coordenadas
    mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },

  typography: {
    // Display - Títulos grandes, páginas vazias
    display: {
      size: '2.25rem', // 36px
      lineHeight: '2.5rem', // 40px
      weight: '700',
      letterSpacing: '-0.02em',
    },

    // H1 - Título de página
    h1: {
      size: '1.875rem', // 30px
      lineHeight: '2.25rem', // 36px
      weight: '700',
      letterSpacing: '-0.01em',
    },

    // H2 - Seções importantes
    h2: {
      size: '1.5rem', // 24px
      lineHeight: '2rem', // 32px
      weight: '600',
      letterSpacing: '-0.01em',
    },

    // H3 - Sub-seções
    h3: {
      size: '1.25rem', // 20px
      lineHeight: '1.75rem', // 28px
      weight: '600',
      letterSpacing: '0',
    },

    // Body Large - Texto importante
    bodyLg: {
      size: '1.125rem', // 18px
      lineHeight: '1.75rem', // 28px
      weight: '400',
    },

    // Body - Texto padrão
    body: {
      size: '1rem', // 16px
      lineHeight: '1.5rem', // 24px
      weight: '400',
    },

    // Body Small - Texto secundário
    bodySm: {
      size: '0.875rem', // 14px
      lineHeight: '1.25rem', // 20px
      weight: '400',
    },

    // Caption - Labels, hints
    caption: {
      size: '0.75rem', // 12px
      lineHeight: '1rem', // 16px
      weight: '500',
      letterSpacing: '0.02em',
    },
  },

  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px - base
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
  },

  spacingUsage: {
    containerPadding: '1rem', // 16px
    cardPadding: '1rem', // 16px
    sectionGap: '1.5rem', // 24px
    stackGap: '0.75rem', // 12px
    inlineGap: '0.5rem', // 8px
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px - badges pequenos
    base: '0.5rem', // 8px - botões, inputs
    md: '0.75rem', // 12px - cards
    lg: '1rem', // 16px - modais, containers
    xl: '1.5rem', // 24px - elementos hero
    full: '9999px', // circular - avatars, pills
  },

  shadows: {
    // Sombras sutis para elevação
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',

    // Sombra colorida para FAB e elementos especiais
    primary: '0 10px 20px -5px rgba(59, 130, 246, 0.3)',
    accent: '0 10px 20px -5px rgba(245, 158, 11, 0.3)',
  },

  buttonStyles: {
    // Primary - Ação principal
    primary: {
      background: '#2563eb',
      color: 'white',
      hover: '#1d4ed8',
      active: '#1e40af',
      padding: '0.75rem 1.5rem', // 12px 24px
      borderRadius: '0.5rem',
      fontWeight: '600',
      fontSize: '0.875rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    },

    // Secondary - Ação secundária
    secondary: {
      background: '#f5f5f5',
      color: '#404040',
      hover: '#e5e5e5',
      active: '#d4d4d4',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      shadow: 'none',
    },

    // Ghost - Ação terciária
    ghost: {
      background: 'transparent',
      color: '#2563eb',
      hover: '#eff6ff',
      active: '#dbeafe',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      shadow: 'none',
    },

    // Icon - Botão apenas ícone
    icon: {
      background: 'transparent',
      color: '#525252',
      hover: '#f5f5f5',
      active: '#e5e5e5',
      size: '2.5rem', // 40px
      borderRadius: '9999px',
      shadow: 'none',
    },
  },

  cardStyles: {
    default: {
      background: 'white',
      border: '1px solid',
      borderColor: '#e5e5e5',
      borderRadius: '0.75rem',
      padding: '1rem',
      shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      hover: {
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        borderColor: '#bfdbfe',
      },
    },
  },

  badgeStyles: {
    // Por categoria
    monument: { bg: '#dbeafe', color: '#1e40af' }, // Azul
    museum: { bg: '#e0e7ff', color: '#4338ca' }, // Índigo
    restaurant: { bg: '#fef3c7', color: '#92400e' }, // Âmbar
    temple: { bg: '#fce7f3', color: '#831843' }, // Rosa
    hotel: { bg: '#e0f2fe', color: '#075985' }, // Ciano
    shopping: { bg: '#f3e8ff', color: '#6b21a8' }, // Roxo
    other: { bg: '#f3f4f6', color: '#374151' }, // Cinza

    // Estilo
    padding: '0.25rem 0.75rem', // 4px 12px
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },

  inputStyles: {
    base: {
      background: 'white',
      border: '1px solid',
      borderColor: '#d4d4d4',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem', // 12px 16px
      fontSize: '1rem',
      focus: {
        borderColor: '#3b82f6',
        outline: '2px solid',
        outlineColor: '#bfdbfe',
        outlineOffset: '0',
      },
    },
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    sunset: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    ocean: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  },
};
