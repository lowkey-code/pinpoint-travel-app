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

const tokens = createTokens({
    size,
    space,
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
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(240, 10%, 3.9%)',
    primary: 'hsl(240, 5.9%, 10%)',
    primaryForeground: 'hsl(0, 0%, 98%)',
    secondary: 'hsl(240, 4.8%, 95.9%)',
    secondaryForeground: 'hsl(240, 5.9%, 10%)',
    muted: 'hsl(240, 4.8%, 95.9%)',
    mutedForeground: 'hsl(240, 3.8%, 46.1%)',
    destructive: 'hsl(0, 84.2%, 60.2%)',
    border: 'hsl(240, 5.9%, 90%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(240, 10%, 3.9%)',
    color: 'hsl(240, 10%, 3.9%)', // fallback text color
}

const darkTheme = {
    background: 'hsl(240, 10%, 3.9%)',
    foreground: 'hsl(0, 0%, 98%)',
    primary: 'hsl(0, 0%, 98%)',
    primaryForeground: 'hsl(240, 5.9%, 10%)',
    secondary: 'hsl(240, 3.7%, 15.9%)',
    secondaryForeground: 'hsl(0, 0%, 98%)',
    muted: 'hsl(240, 3.7%, 15.9%)',
    mutedForeground: 'hsl(240, 5%, 64.9%)',
    destructive: 'hsl(0, 62.8%, 30.6%)',
    border: 'hsl(240, 3.7%, 15.9%)',
    card: 'hsl(240, 10%, 3.9%)',
    cardForeground: 'hsl(0, 0%, 98%)',
    color: 'hsl(0, 0%, 98%)', // fallback text color
}

const config = createTamagui({
    animations,
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
