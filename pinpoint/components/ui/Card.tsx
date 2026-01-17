import { styled, YStack, GetProps, Stack } from 'tamagui'

/**
 * Main Card Root component with subtle shadow and rounded corners.
 */
export const CardRoot = styled(YStack, {
    name: 'Card',
    backgroundColor: '$card',
    borderRadius: 16,
    padding: '$4',
    borderWidth: 1,
    borderColor: '$border',

    // Subtle elevation for native and web
    shadowColor: '$black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, // Android specific elevation

    animation: 'quick',

    variants: {
        hoverable: {
            true: {
                hoverStyle: {
                    scale: 1.01,
                    borderColor: '$primary',
                    shadowOpacity: 0.1,
                    cursor: 'pointer',
                },
            },
        },
        pressable: {
            true: {
                pressStyle: {
                    scale: 0.98,
                    opacity: 0.9,
                },
            },
        },
    } as const,
})

/**
 * Card Header for titles and actions
 */
export const CardHeader = styled(YStack, {
    name: 'CardHeader',
    marginBottom: '$3',
    gap: '$1',
})

/**
 * Card Content for the main body of information
 */
export const CardContent = styled(Stack, {
    name: 'CardContent',
    flex: 1,
})

/**
 * Card Footer for actions or extra info at the bottom
 */
export const CardFooter = styled(Stack, {
    name: 'CardFooter',
    flexDirection: 'row',
    marginTop: '$4',
    justifyContent: 'flex-end',
    gap: '$3',
})

// Types for props
export type CardProps = GetProps<typeof CardRoot>

/**
 * Card Component with Composition Pattern
 */
export const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Content: CardContent,
    Footer: CardFooter,
})
