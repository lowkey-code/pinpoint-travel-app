import React, { useCallback } from 'react'
import { Pressable, Platform } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
} from 'react-native-reanimated'
import { XStack, useTheme } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface FABProps {
    onPress: () => void
    icon?: React.ReactNode
    disabled?: boolean
    testID?: string
}

/**
 * Floating Action Button (FAB) Component
 *
 * A circular floating action button positioned at the bottom-right corner
 * with spring animation on press. Safe area aware.
 *
 * Features:
 * - Animated scale on press using react-native-reanimated
 * - Elevated shadow
 * - Safe area aware (respects home indicator on iOS)
 * - Theme aware (uses primary color)
 * - Performance optimized
 *
 * Usage:
 * ```tsx
 * <FAB onPress={() => openAddPlaceSheet()} />
 * ```
 */
export function FAB({
    onPress,
    icon,
    disabled = false,
    testID = 'fab-button',
}: FABProps) {
    const insets = useSafeAreaInsets()
    const theme = useTheme()

    // Shared value for scale animation
    const scale = useSharedValue(1)

    // Animated style for scale transformation
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        }
    }, [])

    /**
     * Handle press: animate scale down then back up
     */
    const handlePress = useCallback(() => {
        if (disabled) return

        scale.value = withSequence(
            // Press down: scale to 0.92
            withSpring(0.92, {
                damping: 10,
                mass: 0.9,
                stiffness: 100,
            }),
            // Release: scale back to 1
            withSpring(1, {
                damping: 10,
                mass: 0.9,
                stiffness: 100,
            })
        )

        // Call the callback
        onPress()
    }, [disabled, onPress, scale])

    /**
     * Calculate FAB bottom position considering safe area
     * Add small margin (16px) + bottom inset from safe area
     */
    const fabBottom = 16 + (insets.bottom > 0 ? insets.bottom : 0)
    const fabRight = 16

    /**
     * Shadow styles - platform specific
     */
    const shadowStyle = Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
        },
        android: {
            elevation: 8,
        },
        web: {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        } as any,
    })

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    bottom: fabBottom,
                    right: fabRight,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    zIndex: 1000,
                    ...shadowStyle,
                },
                animatedStyle,
            ]}
            testID={testID}
        >
            <Pressable
                onPress={handlePress}
                disabled={disabled}
                style={{
                    flex: 1,
                    borderRadius: 30,
                    backgroundColor: theme.primary.val,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: disabled ? 0.5 : 1,
                }}
                android_ripple={{
                    color: 'rgba(255, 255, 255, 0.2)',
                    radius: 30,
                }}
            >
                {icon ? (
                    icon
                ) : (
                    <Plus size={28} color="white" strokeWidth={3} />
                )}
            </Pressable>
        </Animated.View>
    )
}
