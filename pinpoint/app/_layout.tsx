import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import { useTheme } from '../hooks/useTheme';

import config from '../tamagui.config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    });

    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <TamaguiProvider config={config} defaultTheme={resolvedTheme}>
            <Theme name={resolvedTheme}>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: resolvedTheme === 'dark' ? '#111' : '#fff',
                        },
                        headerTintColor: resolvedTheme === 'dark' ? '#fff' : '#000',
                    }}
                >
                    <Stack.Screen name="index" options={{ title: 'Pinpoint' }} />
                    <Stack.Screen name="test-storage" options={{ title: 'Teste de Storage' }} />
                </Stack>
                <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
            </Theme>
        </TamaguiProvider>
    );
}
