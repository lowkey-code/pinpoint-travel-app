import { TextArea as TTextArea, styled, GetProps, YStack, Text, AnimatePresence } from 'tamagui'
import React, { useState } from 'react'

/**
 * Base Styled TextArea using Tamagui's styled() API.
 */
const StyledTextArea = styled(TTextArea, {
    name: 'TextArea',
    minHeight: 100,
    borderRadius: 12,
    backgroundColor: '$background',
    borderColor: '$border',
    borderWidth: 1.5,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    } as const,
})

export type TextAreaProps = Omit<GetProps<typeof StyledTextArea>, 'error'> & {
    label?: string
    error?: string
}

/**
 * Custom TextArea Component with Label and Error Messages.
 */
export const TextArea = StyledTextArea.styleable<TextAreaProps>(
    ({ label, error, value, defaultValue, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false)

        return (
            <YStack width="100%" gap="$1" marginBottom="$2">
                {label && (
                    <Text
                        fontSize={14}
                        fontWeight="600"
                        color={error ? '$destructive' : isFocused ? '$primary' : '$foreground'}
                        marginLeft="$1"
                    >
                        {label}
                    </Text>
                )}

                <StyledTextArea
                    ref={ref}
                    error={!!error}
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
