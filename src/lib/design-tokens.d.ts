declare module '@/lib/design-tokens' {
  export const designTokens: {
    colors: {
      primary: Record<string, string>;
      secondary: Record<string, string>;
      accent: Record<string, string>;
      neutral: Record<string, string>;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    fonts: {
      heading: string;
      body: string;
      mono: string;
    };
    typography: Record<string, any>;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    shadows: Record<string, string>;
    gradients: Record<string, string>;
    buttonStyles: Record<string, any>;
    cardStyles: Record<string, any>;
    badgeStyles: Record<string, any>;
    inputStyles: Record<string, any>;
    breakpoints: Record<string, string>;
    zIndex?: Record<string, number | string>;
  };
}
