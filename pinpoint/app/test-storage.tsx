import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { YStack, Text, H2, H3, Paragraph, XStack } from 'tamagui';
import { usePlacesStore } from '../lib/stores/places.store';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MapPin, Trash2, Plus, RefreshCw } from '@tamagui/lucide-icons';
import { CATEGORIES } from '../lib/schemas/category.schema';

export default function TestStoragePage() {
    const places = usePlacesStore((state) => state.places);
    const addPlace = usePlacesStore((state) => state.addPlace);
    const deletePlace = usePlacesStore((state) => state.deletePlace);
    const isLoading = usePlacesStore((state) => state.isLoading);
    const error = usePlacesStore((state) => state.error);

    // Example places to add
    const examplePlaces = [
        {
            name: 'Torre Eiffel',
            address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, França',
            category: 'attraction' as const,
            note: 'Visitar ao pôr do sol para as melhores fotos',
        },
        {
            name: 'Le Jules Verne',
            address: 'Tour Eiffel, 2ème étage, Avenue Gustave Eiffel, 75007 Paris',
            category: 'restaurant' as const,
            note: 'Reserva obrigatória com 3 meses de antecedência',
        },
        {
            name: 'Hôtel Plaza Athénée',
            address: '25 Avenue Montaigne, 75008 Paris, França',
            category: 'hotel' as const,
            note: 'Check-in às 15h, Check-out às 12h',
        },
    ];

    const handleAddExamples = () => {
        examplePlaces.forEach((place) => {
            addPlace(place);
        });
    };

    const getCategoryLabel = (categoryId: string) => {
        const category = CATEGORIES.find((cat) => cat.id === categoryId);
        return category?.label || categoryId;
    };

    return (
        <ScrollView>
            <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
                {/* Header */}
                <YStack gap="$2" marginBottom="$2">
                    <H2>🧪 Teste de Persistência</H2>
                    <Text color="$mutedForeground" fontSize={14}>
                        Este teste valida o sistema de storage universal (MMKV/AsyncStorage/localStorage)
                    </Text>
                </YStack>

                {/* Instructions Card */}
                <Card>
                    <Card.Header>
                        <H3>📋 Instruções</H3>
                    </Card.Header>
                    <Card.Content>
                        <YStack gap="$2">
                            <Text>1. Clique em "Adicionar Lugares de Exemplo"</Text>
                            <Text>2. Veja os 3 lugares aparecerem na lista abaixo</Text>
                            <Text>3. (Opcional) Delete alguns lugares</Text>
                            <Text fontWeight="bold" color="$primary">
                                4. Feche COMPLETAMENTE o app
                            </Text>
                            <Text>5. Reabra o app e volte para esta tela</Text>
                            <Text fontWeight="bold" color="$primary">
                                6. ✅ Os dados devem estar aqui!
                            </Text>
                        </YStack>
                    </Card.Content>
                </Card>

                {/* Status Card */}
                <Card>
                    <Card.Header>
                        <H3>📊 Status</H3>
                    </Card.Header>
                    <Card.Content>
                        <YStack gap="$2">
                            <XStack gap="$2" alignItems="center">
                                <Text fontWeight="600">Total de lugares:</Text>
                                <Text fontSize={20} color="$primary" fontWeight="bold">
                                    {places.length}
                                </Text>
                            </XStack>
                            {places.length > 0 && (
                                <Text color="$primary" fontSize={12}>
                                    ✓ Dados foram salvos no storage
                                </Text>
                            )}
                            {places.length === 0 && (
                                <Text color="$mutedForeground" fontSize={12}>
                                    Nenhum lugar salvo ainda
                                </Text>
                            )}
                        </YStack>
                    </Card.Content>
                </Card>

                {/* Error Display */}
                {error && (
                    <Card>
                        <Card.Content>
                            <Text color="$destructive">❌ Erro: {error}</Text>
                        </Card.Content>
                    </Card>
                )}

                {/* Actions */}
                <YStack gap="$3">
                    <Button
                        size="lg"
                        iconLeft={<Plus size={20} />}
                        onPress={handleAddExamples}
                        loading={isLoading}
                        disabled={places.length >= 3}
                    >
                        {places.length >= 3 ? 'Lugares Adicionados' : 'Adicionar Lugares de Exemplo'}
                    </Button>

                    {places.length > 0 && (
                        <Button
                            size="md"
                            variant="ghost"
                            iconLeft={<RefreshCw size={18} />}
                            onPress={() => {
                                places.forEach((place) => deletePlace(place.id));
                            }}
                        >
                            Limpar Todos
                        </Button>
                    )}
                </YStack>

                {/* Places List */}
                {places.length > 0 && (
                    <YStack gap="$3" marginTop="$2">
                        <H3>📍 Lugares Salvos</H3>

                        {places.map((place, index) => (
                            <Card key={place.id}>
                                <Card.Header>
                                    <XStack gap="$2" alignItems="center">
                                        <Text fontSize={20}>#{index + 1}</Text>
                                        <H3 flex={1}>{place.name}</H3>
                                    </XStack>
                                    <Text color="$mutedForeground" fontSize={13}>
                                        📂 {getCategoryLabel(place.category)}
                                    </Text>
                                </Card.Header>

                                <Card.Content>
                                    <YStack gap="$2">
                                        <XStack gap="$2">
                                            <MapPin size={16} color="var(--color-muted-foreground)" />
                                            <Text flex={1} fontSize={14}>
                                                {place.address}
                                            </Text>
                                        </XStack>

                                        {place.note && (
                                            <Paragraph fontSize={14} color="$mutedForeground">
                                                💭 {place.note}
                                            </Paragraph>
                                        )}

                                        <Text fontSize={12} color="$mutedForeground">
                                            ⏰ Adicionado em: {new Date(place.createdAt).toLocaleString('pt-BR')}
                                        </Text>
                                    </YStack>
                                </Card.Content>

                                <Card.Footer>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        iconLeft={<Trash2 size={16} />}
                                        onPress={() => deletePlace(place.id)}
                                    >
                                        Deletar
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))}
                    </YStack>
                )}

                {/* Bottom spacing */}
                <YStack height="$8" />
            </YStack>
        </ScrollView>
    );
}
