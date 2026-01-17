/**
 * Example: How to use the PlacesStore in a component
 */

import { usePlacesStore } from '@/lib/stores/places.store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { YStack, XStack, Text, H3, Paragraph } from 'tamagui';
import { MapPin, Trash2 } from '@tamagui/lucide-icons';

export function PlacesListExample() {
    // Access store state and actions
    const places = usePlacesStore((state) => state.places);
    const isLoading = usePlacesStore((state) => state.isLoading);
    const error = usePlacesStore((state) => state.error);
    const addPlace = usePlacesStore((state) => state.addPlace);
    const deletePlace = usePlacesStore((state) => state.deletePlace);
    const updatePlace = usePlacesStore((state) => state.updatePlace);

    // Example: Add a new place
    const handleAddPlace = () => {
        addPlace({
            name: 'Torre Eiffel',
            address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, França',
            category: 'attraction',
            note: 'Visitar ao pôr do sol',
        });
    };

    // Example: Delete a place
    const handleDeletePlace = (id: string) => {
        deletePlace(id);
    };

    // Example: Update a place
    const handleUpdatePlace = (id: string) => {
        updatePlace(id, {
            note: 'Atualizado: Visitar de manhã para evitar filas',
        });
    };

    if (isLoading) {
        return <Text>Carregando...</Text>;
    }

    if (error) {
        return <Text color="$destructive">Erro: {error}</Text>;
    }

    return (
        <YStack gap="$4" padding="$4">
            <Button onPress={handleAddPlace} iconLeft={<MapPin size={20} />}>
                Adicionar Lugar de Exemplo
            </Button>

            {places.length === 0 ? (
                <Text color="$mutedForeground">Nenhum lugar salvo ainda</Text>
            ) : (
                places.map((place) => (
                    <Card key={place.id} hoverable>
                        <Card.Header>
                            <H3>{place.name}</H3>
                            <Text color="$mutedForeground" fontSize={14}>
                                {place.address}
                            </Text>
                        </Card.Header>

                        <Card.Content>
                            {place.note && <Paragraph>{place.note}</Paragraph>}
                            <Text fontSize={12} color="$mutedForeground">
                                Adicionado em: {place.createdAt.toLocaleDateString()}
                            </Text>
                        </Card.Content>

                        <Card.Footer>
                            <Button
                                variant="ghost"
                                size="sm"
                                onPress={() => handleUpdatePlace(place.id)}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                iconLeft={<Trash2 size={16} />}
                                onPress={() => handleDeletePlace(place.id)}
                            >
                                Deletar
                            </Button>
                        </Card.Footer>
                    </Card>
                ))
            )}
        </YStack>
    );
}
