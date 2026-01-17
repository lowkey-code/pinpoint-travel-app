import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';
import { useTheme } from '../hooks/useTheme';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { errorLogger } from '../lib/errorLogger';

import config from '../tamagui.config';

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        errorLogger;
    }, []);

    return (
        <Theme name={resolvedTheme}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: resolvedTheme === 'dark' ? '#111' : '#fff',
                    },
                    headerTintColor: resolvedTheme === 'dark' ? '#fff' : '#000',
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="test-storage" options={{ title: 'Teste de Storage' }} />
                <Stack.Screen name="errors" options={{ title: 'Logs de Erros' }} />
            </Stack>
            <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
        </Theme>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ErrorBoundary>
            <SafeAreaProvider>
                <TamaguiProvider config={config} defaultTheme="light">
                    <RootLayoutContent />
                </TamaguiProvider>
            </SafeAreaProvider>
        </ErrorBoundary>
    );
}
