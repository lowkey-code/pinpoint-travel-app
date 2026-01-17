import { Platform } from 'react-native'
import { XStack, YStack, Text, H1, styled, View } from 'tamagui'
import { MapPin, Sun, Moon } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '../ui/Button'
import { useTheme } from '../../hooks/useTheme'

interface HeaderProps {
    placesCount: number
}

const HeaderRoot = styled(XStack, {
    name: 'Header',
    backgroundColor: '$background',
    borderBottomWidth: 1,
    borderColor: '$border',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '$4',
    paddingVertical: '$3',
    zIndex: 100,
})

const LogoContainer = styled(View, {
    width: 44,
    height: 44,
    backgroundColor: '$primary',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
})

/**
 * Header Component - Migrated from Web to Tamagui
 * Displays the app logo, saved places count, and theme toggle.
 * Handles safe area insets for mobile devices.
 */
export function Header({ placesCount }: HeaderProps) {
    const insets = useSafeAreaInsets()
    const { toggleTheme, isDark } = useTheme()

    return (
        <HeaderRoot paddingTop={insets.top > 0 ? insets.top : '$4'}>
            <XStack
                flex={1}
                maxWidth={Platform.OS === 'web' ? 512 : '100%'}
                alignSelf="center"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
            >
                <XStack gap="$3" alignItems="center">
                    <LogoContainer>
                        <MapPin size={22} color="white" />
                    </LogoContainer>

                    <YStack>
                        <H1 fontSize={22} fontWeight="800" letterSpacing={-0.5} color="$foreground">
                            TripStash
                        </H1>
                        <XStack alignItems="center" gap="$1">
                            <View
                                width={6}
                                height={6}
                                borderRadius={3}
                                backgroundColor={placesCount > 0 ? '$primary' : '$muted'}
                            />
                            <Text fontSize={12} color="$mutedForeground" fontWeight="500">
                                {placesCount} {placesCount === 1 ? 'place saved' : 'places saved'}
                            </Text>
                        </XStack>
                    </YStack>
                </XStack>

                <Button
                    variant="secondary"
                    size="sm"
                    borderRadius={12}
                    width={44}
                    height={44}
                    onPress={toggleTheme}
                    icon={isDark ? <Sun size={20} /> : <Moon size={20} />}
                />
            </XStack>
        </HeaderRoot>
    )
}
