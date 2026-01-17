import { useColorScheme } from 'react-native'
import { useTheme as useTamaguiTheme } from 'tamagui'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '../lib/storage/zustand-adapter'

/**
 * Valid theme settings
 */
export type ThemeSetting = 'light' | 'dark' | 'system'

interface ThemeState {
    themeSetting: ThemeSetting
    setThemeSetting: (setting: ThemeSetting) => void
}

/**
 * Persisted store for theme settings using our universal storage
 */
const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            themeSetting: 'system',
            setThemeSetting: (themeSetting) => set({ themeSetting }),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
)

/**
 * Custom hook to manage and toggle themes with persistence and system preference support.
 */
export function useTheme() {
    const tamaguiTheme = useTamaguiTheme()
    const systemColorScheme = useColorScheme()
    const { themeSetting, setThemeSetting } = useThemeStore()

    // Resolve the actual theme based on setting and system preference
    const resolvedTheme =
        themeSetting === 'system'
            ? (systemColorScheme || 'light')
            : themeSetting

    /**
     * Toggles between light and dark. 
     * If it was 'system', it switches to the opposite of the current system theme.
     */
    const toggleTheme = () => {
        const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light'
        setThemeSetting(nextTheme)
    }

    return {
        // Tamagui theme object (tokens)
        theme: tamaguiTheme,
        // The active theme name: 'light' | 'dark'
        resolvedTheme,
        // The saved setting: 'light' | 'dark' | 'system'
        themeSetting,
        // Helper to check if dark mode is active
        isDark: resolvedTheme === 'dark',
        // Actions
        setThemeSetting,
        toggleTheme,
    }
}
