import React, { useCallback, useState } from 'react'
import { Pressable, Platform, View } from 'react-native'
import { useTheme } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Conditional imports for Reanimated (only on native platforms)
let useSharedValue: any = null
let useAnimatedStyle: any = null
let withSpring: any = null
let withSequence: any = null
let AnimatedView: any = View

if (Platform.OS !== 'web') {
    try {
        const Reanimated = require('react-native-reanimated')
        useSharedValue = Reanimated.useSharedValue
        useAnimatedStyle = Reanimated.useAnimatedStyle
        withSpring = Reanimated.withSpring
        withSequence = Reanimated.withSequence
        AnimatedView = Reanimated.default.View
    } catch (e) {
        // Reanimated not available, use fallback
        console.warn('Reanimated not available, using fallback')
    }
}

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
    const { theme } = useTheme()
    const [isPressed, setIsPressed] = useState(false)

    // Get primary color with safe fallback
    const primaryColor = theme?.primary?.val ?? '#e15e3c'

    // Web fallback: simple CSS-based animation
    if (Platform.OS === 'web') {
        const fabBottom = 16 + (insets.bottom > 0 ? insets.bottom : 0)
        const fabRight = 16

        return (
            <Pressable
                onPress={() => {
                    if (!disabled) {
                        setIsPressed(true)
                        setTimeout(() => setIsPressed(false), 200)
                        onPress()
                    }
                }}
                disabled={disabled}
                style={{
                    position: 'absolute',
                    bottom: fabBottom,
                    right: fabRight,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: disabled ? 0.5 : 1,
                    transform: isPressed ? 'scale(0.92)' : 'scale(1)',
                    transition: 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                } as any}
                testID={testID}
            >
                {icon ? (
                    icon
                ) : (
                    <Plus size={28} color="white" strokeWidth={3} />
                )}
            </Pressable>
        )
    }

    // Native platforms: use Reanimated if available
    const scale = useSharedValue ? useSharedValue(1) : null
    const animatedStyle = useAnimatedStyle && scale ? useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        }
    }, []) : {}

    /**
     * Handle press: animate scale down then back up
     */
    const handlePress = useCallback(() => {
        if (disabled || !scale || !withSpring || !withSequence) return

        scale.value = withSequence(
            withSpring(0.92, {
                damping: 10,
                mass: 0.9,
                stiffness: 100,
            }),
            withSpring(1, {
                damping: 10,
                mass: 0.9,
                stiffness: 100,
            })
        )

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
        default: {},
    })

    return (
        <AnimatedView
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
                    backgroundColor: primaryColor,
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
        </AnimatedView>
    )
}
