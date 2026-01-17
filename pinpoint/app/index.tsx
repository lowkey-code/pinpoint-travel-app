import React, { useState, useMemo, useCallback } from 'react'
import { FlatList, Platform } from 'react-native'
import { YStack, View, styled } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header } from '../components/domain/Header'
import { SearchBar } from '../components/domain/SearchBar'
import { CategoryFilter } from '../components/domain/CategoryFilter'
import { PlaceCard } from '../components/domain/PlaceCard'
import { EmptyState } from '../components/domain/EmptyState'
import { AddPlaceSheet } from '../components/domain/AddPlaceSheet'
import { EditPlaceSheet } from '../components/domain/EditPlaceSheet'
import { Button } from '../components/ui/Button'

import { usePlacesStore } from '../lib/stores/places.store'
import type { Place } from '../lib/schemas/place.schema'

/**
 * Floating Action Button (FAB)
 * Positioned at bottom-right with elevation and safe area awareness
 */
const FAB = styled(Button, {
    position: 'absolute',
    right: '$4',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
    pressStyle: {
        scale: 0.92,
        opacity: 0.9,
    },
})

/**
 * Home Screen - Complete Implementation
 *
 * Features:
 * - Header with theme toggle and places count
 * - Search bar with debounce
 * - Horizontal category filter
 * - Optimized list with FlatList
 * - Empty states for different scenarios
 * - FAB for adding new places
 * - Add/Edit sheets
 * - Theme persistence with MMKV
 * - Safe area aware
 */
export default function Home() {
    // Safe area insets for FAB positioning
    const insets = useSafeAreaInsets()

    // Store state and actions
    const { places, addPlace, updatePlace, deletePlace } = usePlacesStore()

    // UI state
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingPlace, setEditingPlace] = useState<Place | null>(null)

    /**
     * Filtered places with memoization
     * Filters by search query and category
     */
    const filteredPlaces = useMemo(() => {
        return places.filter((place) => {
            const matchesSearch =
                place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                place.address.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory ? place.category === selectedCategory : true
            return matchesSearch && matchesCategory
        })
    }, [places, searchQuery, selectedCategory])

    /**
     * Memoized callbacks to prevent re-renders
     */
    const handleOpenAddSheet = useCallback(() => setIsAddOpen(true), [])
    const handleCloseAddSheet = useCallback(() => setIsAddOpen(false), [])
    const handleCloseEditSheet = useCallback(() => setEditingPlace(null), [])

    const handleEditPlace = useCallback((place: Place) => {
        setEditingPlace(place)
    }, [])

    const handleSaveEdit = useCallback((updates: Partial<Place>) => {
        if (editingPlace) {
            updatePlace(editingPlace.id, updates)
            setEditingPlace(null)
        }
    }, [editingPlace, updatePlace])

    const handleAddPlace = useCallback((place: Omit<Place, 'id' | 'createdAt'>) => {
        addPlace(place)
        setIsAddOpen(false)
    }, [addPlace])

    /**
     * FlatList optimizations
     */
    const keyExtractor = useCallback((item: Place) => item.id, [])

    const renderItem = useCallback(({ item }: { item: Place }) => (
        <PlaceCard
            place={item}
            onDelete={deletePlace}
            onEdit={handleEditPlace}
        />
    ), [deletePlace, handleEditPlace])

    const ItemSeparatorComponent = useCallback(() => (
        <View height="$3" />
    ), [])

    const ListHeaderComponent = useMemo(() => (
        <YStack gap="$2" marginBottom="$4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter
                places={places}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
        </YStack>
    ), [searchQuery, places, selectedCategory])

    const ListEmptyComponent = useMemo(() => (
        <EmptyState
            variant={
                places.length === 0 ? 'no-places' :
                searchQuery ? 'no-results' : 'no-category-results'
            }
            searchQuery={searchQuery}
            onAction={places.length === 0 ? handleOpenAddSheet : undefined}
        />
    ), [places.length, searchQuery, handleOpenAddSheet])

    /**
     * Dynamic FAB bottom position with safe area
     */
    const fabBottom = useMemo(() => {
        const baseBottom = 24
        const bottomInset = insets.bottom > 0 ? insets.bottom : 0
        return baseBottom + bottomInset
    }, [insets.bottom])

    return (
        <YStack flex={1} backgroundColor="$background">
            {/* Header */}
            <Header placesCount={places.length} />

            {/* Main Content List */}
            <YStack flex={1}>
                <FlatList
                    data={filteredPlaces}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    ListHeaderComponent={ListHeaderComponent}
                    ListEmptyComponent={ListEmptyComponent}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: fabBottom + 80, // Room for FAB
                    }}
                    // Performance optimizations
                    removeClippedSubviews={Platform.OS === 'android'}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    windowSize={21}
                    // Disable virtualization warnings on web
                    {...(Platform.OS === 'web' && {
                        persistentScrollbar: true,
                    })}
                />
            </YStack>

            {/* Floating Action Button */}
            <FAB
                bottom={fabBottom}
                icon={<Plus size={28} color="white" />}
                onPress={handleOpenAddSheet}
                aria-label="Adicionar lugar"
            />

            {/* Add Place Sheet */}
            <AddPlaceSheet
                isOpen={isAddOpen}
                onClose={handleCloseAddSheet}
                onAdd={handleAddPlace}
            />

            {/* Edit Place Sheet */}
            <EditPlaceSheet
                place={editingPlace}
                isOpen={!!editingPlace}
                onClose={handleCloseEditSheet}
                onSave={handleSaveEdit}
            />
        </YStack>
    )
}
