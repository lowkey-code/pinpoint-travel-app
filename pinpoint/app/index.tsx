import React, { useState, useMemo } from 'react'
import { FlatList } from 'react-native'
import { YStack, View, styled, Theme } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'

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
 */
const FAB = styled(Button, {
    position: 'absolute',
    bottom: '$6',
    right: '$4',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '$black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
})

export default function Home() {
    // Store State and Actions
    const { places, addPlace, updatePlace, deletePlace } = usePlacesStore()

    // UI State
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingPlace, setEditingPlace] = useState<Place | null>(null)

    /**
     * Filtered Places Logic
     */
    const filteredPlaces = useMemo(() => {
        return places.filter((place) => {
            const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                place.address.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory ? place.category === selectedCategory : true
            return matchesSearch && matchesCategory
        })
    }, [places, searchQuery, selectedCategory])

    /**
     * Render Content
     */
    return (
        <YStack flex={1} backgroundColor="$background">
            {/* Main Header */}
            <Header placesCount={places.length} />

            {/* Content Container */}
            <YStack flex={1}>
                <FlatList
                    data={filteredPlaces}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 100, // Room for FAB
                        gap: 16
                    }}
                    ListHeaderComponent={
                        <YStack gap="$2" marginBottom="$4">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                            <CategoryFilter
                                places={places}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
                        </YStack>
                    }
                    ListEmptyComponent={
                        <EmptyState
                            variant={
                                places.length === 0 ? 'no-places' :
                                    searchQuery ? 'no-results' : 'no-category-results'
                            }
                            searchQuery={searchQuery}
                            onAction={places.length === 0 ? () => setIsAddOpen(true) : undefined}
                        />
                    }
                    renderItem={({ item }) => (
                        <PlaceCard
                            place={item}
                            onDelete={deletePlace}
                            onEdit={setEditingPlace}
                        />
                    )}
                />
            </YStack>

            {/* Addition FAB */}
            <FAB
                icon={<Plus size={28} color="white" />}
                onPress={() => setIsAddOpen(true)}
            />

            {/* Modals/Sheets */}
            <AddPlaceSheet
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onAdd={addPlace}
            />

            <EditPlaceSheet
                place={editingPlace}
                isOpen={!!editingPlace}
                onClose={() => setEditingPlace(null)}
                onSave={(updates) => {
                    if (editingPlace) {
                        updatePlace(editingPlace.id, updates)
                    }
                }}
            />
        </YStack>
    )
}
