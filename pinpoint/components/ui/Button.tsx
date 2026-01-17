import { Button as TButton, Spinner, styled, GetProps, Text } from 'tamagui'
import React, { forwardRef } from 'react'

/**
 * Base Styled Button using Tamagui's styled() API.
 * Defines variants for visuals and sizes.
 */
const StyledButton = styled(TButton, {
    name: 'Button',
    animation: 'quick',
    borderRadius: '$2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '$2',

    pressStyle: {
        scale: 0.96,
        opacity: 0.9,
    },

    variants: {
        variant: {
            default: {
                backgroundColor: '$primary',
                color: '$primaryForeground',
                borderWidth: 1,
                borderColor: '$primary',
                hoverStyle: { backgroundColor: '$primary', opacity: 0.9 },
            },
            secondary: {
                backgroundColor: '$secondary',
                color: '$secondaryForeground',
                borderWidth: 1,
                borderColor: '$border',
                hoverStyle: { backgroundColor: '$secondary', opacity: 0.8 },
            },
            destructive: {
                backgroundColor: '$destructive',
                color: '$white',
                hoverStyle: { backgroundColor: '$destructive', opacity: 0.9 },
            },
            ghost: {
                backgroundColor: 'transparent',
                color: '$foreground',
                hoverStyle: { backgroundColor: '$secondary' },
                pressStyle: { backgroundColor: '$secondary', scale: 0.96 },
            },
        },
        size: {
            sm: {
                height: '$3',
                paddingHorizontal: '$3',
                borderRadius: '$1',
            },
            md: {
                height: '$4',
                paddingHorizontal: '$4',
                borderRadius: '$2',
            },
            lg: {
                height: '$5',
                paddingHorizontal: '$6',
                borderRadius: '$3',
            },
        },
    } as const,

    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
})

// Define extra props for our component
export type ButtonProps = GetProps<typeof StyledButton> & {
    loading?: boolean
    iconLeft?: React.ReactNode
}

/**
 * Custom Button Component
 * Supports loading state with Spinner and left-aligned icons.
 */
export const Button = StyledButton.styleable<ButtonProps>(
    ({ loading, iconLeft, children, ...props }, ref) => {
        // Determine the loader/icon color based on variant
        const isPrimary = props.variant === 'default' || props.variant === 'destructive'
        const contentColor = isPrimary ? '$primaryForeground' : '$foreground'

        return (
            <StyledButton
                ref={ref}
                disabled={loading || props.disabled}
                {...props}
            >
                {loading ? (
                    <Spinner color={contentColor as any} />
                ) : (
                    iconLeft
                )}

                {/* We wrap children in Text if it's a string to ensure theme/color inheritance works cleanly */}
                {typeof children === 'string' ? (
                    <Text
                        color="inherit"
                        fontSize={props.size === 'sm' ? 12 : props.size === 'lg' ? 16 : 14}
                        fontWeight="600"
                    >
                        {children}
                    </Text>
                ) : (
                    children
                )}
            </StyledButton>
        )
    }
)
