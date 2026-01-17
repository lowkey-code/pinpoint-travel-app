import { createAnimations } from '@tamagui/animations-react-native'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'
import { shorthands } from '@tamagui/shorthands'
import { createTamagui, createTokens } from 'tamagui'

const animations = createAnimations({
    bouncy: {
        type: 'spring',
        damping: 10,
        mass: 0.9,
        stiffness: 100,
    },
    lazy: {
        type: 'spring',
        damping: 20,
        stiffness: 60,
    },
    quick: {
        type: 'spring',
        damping: 20,
        mass: 1.2,
        stiffness: 250,
    },
})

const headingFont = createInterFont()
const bodyFont = createInterFont()

const space = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    true: 16,
}

const size = {
    ...space,
}

const fontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
}

const tokens = createTokens({
    size,
    space,
    fontSize,
    zIndex: { 0: 0, 1: 100, 2: 200 },
    color: {
        white: '#FFFFFF',
        black: '#000000',
    },
    radius: {
        0: 0,
        1: 4,
        2: 8,
        3: 12,
        4: 16,
        true: 8,
    },
})

const lightTheme = {
    background: '#fefaf6',
    backgroundHover: '#f5f0ed',
    foreground: '#3f3935',
    primary: '#e15e3c',
    primaryForeground: '#ffffff',
    secondary: '#f8eee3',
    secondaryForeground: '#3f3935',
    muted: '#f0e8e0',
    mutedForeground: '#7a726a',
    destructive: '#c2410c',
    border: '#e8dfd5',
    card: '#ffffff',
    cardForeground: '#3f3935',
    color: '#3f3935',
}

const darkTheme = {
    background: '#241f1c',
    backgroundHover: '#2c2622',
    foreground: '#f5f0ed',
    primary: '#f48c6a',
    primaryForeground: '#241f1c',
    secondary: '#352f2b',
    secondaryForeground: '#f5f0ed',
    muted: '#352f2b',
    mutedForeground: '#a59b94',
    destructive: '#991b1b',
    border: '#453e3a',
    card: '#2c2622',
    cardForeground: '#f5f0ed',
    color: '#f5f0ed',
}

const config = createTamagui({
    // animations,
    defaultTheme: 'light',
    shouldAddPrefersColorOverride: true,
    themeClassNameOnRoot: !!process.env.TAMAGUI_TARGET,
    shorthands,
    fonts: {
        heading: headingFont,
        body: bodyFont,
    },
    themes: {
        light: lightTheme,
        dark: darkTheme,
    },
    tokens,
    media: createMedia({
        xs: { maxWidth: 660 },
        sm: { maxWidth: 800 },
        md: { maxWidth: 1020 },
        lg: { maxWidth: 1280 },
        xl: { maxWidth: 1420 },
        xxl: { maxWidth: 1600 },
        gtXs: { minWidth: 660 + 1 },
        gtSm: { minWidth: 800 + 1 },
        gtMd: { minWidth: 1020 + 1 },
        gtLg: { minWidth: 1280 + 1 },
        short: { maxHeight: 820 },
        tall: { minHeight: 820 },
        hoverNone: { hover: 'none' },
    }),
})

export type AppConfig = typeof config

declare module 'tamagui' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface TamaguiCustomConfig extends AppConfig { }
}

export default config
