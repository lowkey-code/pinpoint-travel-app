import React from 'react'
import { YStack, XStack, Text, H3, View, styled } from 'tamagui'
import { MapPin, Search, Filter, Plus } from '@tamagui/lucide-icons'
import { Button } from '../ui/Button'

export type EmptyStateVariant = 'no-places' | 'no-results' | 'no-category-results'

interface EmptyStateProps {
    variant: EmptyStateVariant
    searchQuery?: string
    onAction?: () => void
    actionLabel?: string
}

const IconContainer = styled(View, {
    backgroundColor: '$secondary',
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '$4',

    variants: {
        primary: {
            true: {
                backgroundColor: '$primary',
                opacity: 0.1,
            }
        }
    } as const
})

/**
 * EmptyState Component - Migrated from Web to Tamagui
 * Displays feedback when there are no places, no search results, or no matches in a category.
 */
export function EmptyState({ variant, searchQuery, onAction, actionLabel }: EmptyStateProps) {
    const getContent = () => {
        switch (variant) {
            case 'no-results':
                return {
                    icon: <Search size={32} color="$mutedForeground" />,
                    title: 'No results found',
                    description: searchQuery
                        ? `We couldn't find any places for "${searchQuery}"`
                        : 'No places found with the current filters.',
                    primaryIcon: false,
                }
            case 'no-category-results':
                return {
                    icon: <Filter size={32} color="$mutedForeground" />,
                    title: 'Empty category',
                    description: "You haven't saved any places in this category yet.",
                    primaryIcon: false,
                }
            case 'no-places':
            default:
                return {
                    icon: <MapPin size={40} color="$primary" />,
                    title: 'Your journey starts here',
                    description: 'Save places you want to visit. They will be available offline!',
                    primaryIcon: true,
                }
        }
    }

    const content = getContent()

    return (
        <YStack
            paddingHorizontal="$6"
            paddingVertical="$10"
            alignItems="center"
            justifyContent="center"
        >
            <IconContainer primary={content.primaryIcon}>
                {content.icon}
            </IconContainer>

            <H3
                textAlign="center"
                fontWeight="700"
                marginBottom="$2"
                color="$foreground"
            >
                {content.title}
            </H3>

            <Text
                textAlign="center"
                color="$mutedForeground"
                fontSize={16}
                lineHeight={22}
                maxWidth={280}
                marginBottom={onAction ? '$6' : 0}
            >
                {content.description}
            </Text>

            {onAction && (
                <Button
                    onPress={onAction}
                    iconLeft={<Plus size={18} />}
                    size="md"
                    borderRadius={12}
                >
                    {actionLabel || 'Add First Place'}
                </Button>
            )}

            {variant === 'no-places' && !onAction && (
                <XStack marginTop="$4" gap="$2" alignItems="center" opacity={0.6}>
                    <Text fontSize={14} color="$mutedForeground">Tap the button</Text>
                    <View
                        backgroundColor="$primary"
                        width={28}
                        height={28}
                        borderRadius={14}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Plus size={14} color="white" />
                    </View>
                    <Text fontSize={14} color="$mutedForeground">to get started</Text>
                </XStack>
            )}
        </YStack>
    )
}
