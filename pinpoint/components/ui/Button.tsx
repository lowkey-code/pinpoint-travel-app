import { Button as TButton, Spinner, styled, GetProps, Text } from 'tamagui'
import React from 'react'

/**
 * Custom Button component for Pinpoint
 */
export const StyledButton = styled(TButton, {
    name: 'Button',
    borderRadius: 12,

    pressStyle: {
        scale: 0.96,
    },

    variants: {
        variant: {
            default: {
                backgroundColor: '$primary',
                color: '$primaryForeground',
            },
            secondary: {
                backgroundColor: '$secondary',
                color: '$secondaryForeground',
            },
            destructive: {
                backgroundColor: '$destructive',
                color: 'white',
            },
            ghost: {
                backgroundColor: 'transparent',
                color: '$foreground',
                pressStyle: {
                    backgroundColor: '$secondary',
                }
            },
            outlined: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '$border',
                color: '$foreground',
            }
        },
        size: {
            sm: {
                height: 40,
                paddingHorizontal: 12,
            },
            md: {
                height: 48,
                paddingHorizontal: 20,
            },
            lg: {
                height: 56,
                paddingHorizontal: 24,
            }
        }
    } as const,

    defaultVariants: {
        variant: 'default',
        size: 'md'
    }
})

export type ButtonProps = GetProps<typeof StyledButton> & {
    loading?: boolean
    iconLeft?: React.ReactNode
}

export const Button = StyledButton.styleable<ButtonProps>(
    ({ loading, iconLeft, children, ...props }, ref) => {
        return (
            <StyledButton ref={ref} disabled={loading || props.disabled} {...props}>
                {loading ? <Spinner color="$foreground" /> : iconLeft}
                {typeof children === 'string' ? (
                    <Text
                        color="inherit"
                        fontWeight="600"
                        fontSize={props.size === 'sm' ? '$sm' : '$md'}
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
