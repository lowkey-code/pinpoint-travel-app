import React from 'react'
import { ScrollView } from 'react-native'
import {
    XStack,
    YStack,
    Text,
    styled,
    Button as TButton,
    View
} from 'tamagui'

import { CATEGORIES } from '../../lib/schemas/category.schema'
import type { Place } from '../../lib/schemas/place.schema'

interface CategoryFilterProps {
    selectedCategory: string | null
    onSelectCategory: (category: string | null) => void
    places: Place[]
}

/**
 * Filter Chip Styled Component
 */
const FilterChip = styled(TButton, {
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    gap: '$2',
    paddingHorizontal: '$3',
    borderWidth: 1.5,
    flexShrink: 0,

    variants: {
        active: {
            true: {
                backgroundColor: '$primary',
                borderColor: '$primary',
                color: '$primaryForeground',
                hoverStyle: { backgroundColor: '$primary', opacity: 0.9 },
            },
            false: {
                backgroundColor: '$secondary',
                borderColor: '$border',
                color: '$secondaryForeground',
                hoverStyle: { backgroundColor: '$secondary', opacity: 0.8 },
            }
        }
    } as const,

    defaultVariants: {
        active: false
    }
})

/**
 * Badge for counts inside chips
 */
const Badge = styled(View, {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    borderRadius: 10,
    marginLeft: 4,

    variants: {
        active: {
            false: {
                backgroundColor: 'rgba(0,0,0,0.05)',
            }
        }
    } as const
})

export function CategoryFilter({ selectedCategory, onSelectCategory, places }: CategoryFilterProps) {
    const getCategoryCount = (categoryId: string) => {
        return places.filter((p) => p.category === categoryId).length
    }

    return (
        <View marginHorizontal="$-4" paddingVertical="$2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    gap: 8,
                    flexDirection: 'row'
                }}
            >
                {/* All Filter */}
                <FilterChip
                    active={selectedCategory === null}
                    onPress={() => onSelectCategory(null)}
                >
                    <Text
                        fontSize={14}
                        fontWeight="600"
                        color={selectedCategory === null ? '$primaryForeground' : '$secondaryForeground'}
                    >
                        All
                    </Text>
                    <Badge active={selectedCategory === null}>
                        <Text
                            fontSize={11}
                            fontWeight="700"
                            color={selectedCategory === null ? '$primaryForeground' : '$secondaryForeground'}
                        >
                            {places.length}
                        </Text>
                    </Badge>
                </FilterChip>

                {/* Categories */}
                {CATEGORIES.map((category) => {
                    const count = getCategoryCount(category.id)
                    if (count === 0 && selectedCategory !== category.id) return null

                    const isActive = selectedCategory === category.id

                    return (
                        <FilterChip
                            key={category.id}
                            active={isActive}
                            onPress={() => onSelectCategory(isActive ? null : category.id)}
                        >
                            <Text fontSize={16}>{category.icon}</Text>
                            <Text
                                fontSize={14}
                                fontWeight="600"
                                color={isActive ? '$primaryForeground' : '$secondaryForeground'}
                            >
                                {category.label}
                            </Text>
                            <Badge active={isActive}>
                                <Text
                                    fontSize={11}
                                    fontWeight="700"
                                    color={isActive ? '$primaryForeground' : '$secondaryForeground'}
                                >
                                    {count}
                                </Text>
                            </Badge>
                        </FilterChip>
                    )
                })}
            </ScrollView>
        </View>
    )
}
