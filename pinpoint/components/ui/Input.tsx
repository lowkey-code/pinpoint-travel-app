import React, { useState } from 'react'
import {
    Input as TInput,
    YStack,
    XStack,
    Text,
    styled,
    GetProps,
    AnimatePresence,
} from 'tamagui'

/**
 * Base Styled Input using Tamagui's styled() API.
 * Defines the core look, height, and focus states.
 */
const StyledInput = styled(TInput, {
    name: 'Input',
    height: 56, // Fixed height for tap target
    borderRadius: 12,
    backgroundColor: '$background',
    borderColor: '$border',
    borderWidth: 1.5,
    fontSize: 16,
    paddingHorizontal: 16,
    color: '$foreground',
    animation: 'quick',

    focusStyle: {
        borderColor: '$primary',
        borderWidth: 2,
        backgroundColor: '$background',
    },

    variants: {
        error: {
            true: {
                borderColor: '$destructive',
                focusStyle: {
                    borderColor: '$destructive',
                },
            },
        },
        hasIcon: {
            true: {
                paddingLeft: 48,
            },
        },
    } as const,
})

export type InputProps = Omit<GetProps<typeof StyledInput>, 'error'> & {
    label?: string
    error?: string
    icon?: React.ReactNode
}

/**
 * Custom Input Component with Floating Label, Icons and Error Messages.
 */
export const Input = StyledInput.styleable<InputProps>(
    ({ label, error, icon, value, defaultValue, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false)
        const hasValue = (value?.toString().length ?? defaultValue?.toString().length ?? 0) > 0
        const isFloating = isFocused || hasValue

        return (
            <YStack width="100%" gap="$1" marginBottom="$2">
                <XStack width="100%" position="relative">
                    {/* Left Icon */}
                    {icon && (
                        <XStack
                            position="absolute"
                            left={16}
                            top={0}
                            bottom={0}
                            zIndex={20}
                            alignItems="center"
                            justifyContent="center"
                        >
                            {icon}
                        </XStack>
                    )}

                    {/* Floating Label */}
                    {label && (
                        <Text
                            position="absolute"
                            left={icon ? 48 : 16}
                            animation="quick"
                            pointerEvents="none"
                            zIndex={10}
                            color={error ? '$destructive' : isFocused ? '$primary' : '$mutedForeground'}
                            {...(isFloating
                                ? {
                                    top: 8,
                                    fontSize: 12,
                                }
                                : {
                                    top: 16,
                                    fontSize: 16,
                                })}
                        >
                            {label}
                        </Text>
                    )}

                    <StyledInput
                        ref={ref}
                        error={!!error}
                        hasIcon={!!icon}
                        paddingTop={label ? 20 : 0} // Make room for floating label inside the input
                        onFocus={(e) => {
                            setIsFocused(true)
                            onFocus?.(e)
                        }}
                        onBlur={(e) => {
                            setIsFocused(false)
                            onBlur?.(e)
                        }}
                        value={value}
                        defaultValue={defaultValue}
                        {...props}
                    />
                </XStack>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <Text
                            enterStyle={{ opacity: 0, y: -5 }}
                            exitStyle={{ opacity: 0, y: -5 }}
                            animation="quick"
                            fontSize={13}
                            color="$destructive"
                            marginLeft="$2"
                        >
                            {error}
                        </Text>
                    )}
                </AnimatePresence>
            </YStack>
        )
    }
)
