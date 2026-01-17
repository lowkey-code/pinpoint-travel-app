import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { YStack, XStack, Button, Card, Paragraph } from 'tamagui';
import { useErrorsStore } from '../lib/stores/errors.store';
import { useTheme } from '../hooks/useTheme';

export default function ErrorsScreen() {
    const { errors, clearErrors, removeError } = useErrorsStore();
    const { isDark } = useTheme();

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('pt-BR');
    };

    const getSourceColor = (source: string) => {
        const colors: Record<string, string> = {
            javascript: '#dc2626',
            promise: '#f97316',
            react: '#7c3aed',
            app: '#0ea5e9',
        };
        return colors[source] || '#6b7280';
    };

    const renderError = ({ item: error, index }: any) => (
        <Card
            key={error.id}
            marginBottom="$3"
            marginHorizontal="$4"
            padding="$3"
            backgroundColor={isDark ? '#1f2937' : '#f3f4f6'}
            borderColor={getSourceColor(error.source)}
            borderLeftWidth={4}
        >
            <YStack gap="$2">
                <XStack justifyContent="space-between" alignItems="flex-start">
                    <YStack flex={1} gap="$1">
                        <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#f3f4f6' : '#111827' }}>
                            {error.message}
                        </Text>
                        <XStack gap="$2">
                            <Text
                                style={{
                                    fontSize: 11,
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    backgroundColor: getSourceColor(error.source),
                                    color: '#fff',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                }}
                            >
                                {error.source.toUpperCase()}
                            </Text>
                            <Text style={{ fontSize: 11, color: isDark ? '#9ca3af' : '#6b7280' }}>
                                {formatDate(error.timestamp)}
                            </Text>
                        </XStack>
                    </YStack>
                    <TouchableOpacity
                        onPress={() => removeError(error.id)}
                        style={{
                            padding: 8,
                            marginLeft: 8,
                        }}
                    >
                        <Text style={{ fontSize: 18, color: '#ef4444' }}>×</Text>
                    </TouchableOpacity>
                </XStack>

                {error.stack && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Text
                            style={{
                                fontSize: 10,
                                fontFamily: 'monospace',
                                color: isDark ? '#d1d5db' : '#374151',
                                marginTop: 8,
                            }}
                        >
                            {error.stack.slice(0, 300)}
                            {error.stack.length > 300 ? '...' : ''}
                        </Text>
                    </ScrollView>
                )}

                {error.context && Object.keys(error.context).length > 0 && (
                    <View
                        style={{
                            marginTop: 8,
                            padding: 8,
                            backgroundColor: isDark ? '#111827' : '#e5e7eb',
                            borderRadius: 4,
                        }}
                    >
                        <Text style={{ fontSize: 11, color: isDark ? '#9ca3af' : '#4b5563', fontWeight: '600' }}>
                            Contexto:
                        </Text>
                        {Object.entries(error.context).map(([key, value]) => (
                            <Text key={key} style={{ fontSize: 10, color: isDark ? '#9ca3af' : '#6b7280', marginTop: 2 }}>
                                {key}: {String(value).slice(0, 100)}
                            </Text>
                        ))}
                    </View>
                )}
            </YStack>
        </Card>
    );

    return (
        <YStack flex={1} backgroundColor={isDark ? '#0f172a' : '#fff'}>
            <XStack
                paddingHorizontal="$4"
                paddingVertical="$3"
                borderBottomWidth={1}
                borderBottomColor={isDark ? '#1f2937' : '#e5e7eb'}
                justifyContent="space-between"
                alignItems="center"
            >
                <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#f3f4f6' : '#111827' }}>
                    Total de Erros: {errors.length}
                </Text>
                {errors.length > 0 && (
                    <TouchableOpacity onPress={clearErrors}>
                        <Text style={{ fontSize: 14, color: '#ef4444', fontWeight: '600' }}>Limpar</Text>
                    </TouchableOpacity>
                )}
            </XStack>

            {errors.length === 0 ? (
                <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
                    <Text style={{ fontSize: 18, color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '600' }}>
                        Nenhum erro capturado
                    </Text>
                    <Text style={{ fontSize: 14, color: isDark ? '#6b7280' : '#9ca3af', textAlign: 'center', marginHorizontal: '$4' }}>
                        Os erros que ocorrem na aplicação aparecerão aqui automaticamente
                    </Text>
                </YStack>
            ) : (
                <FlatList
                    data={errors}
                    renderItem={renderError}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    scrollEnabled={true}
                />
            )}
        </YStack>
    );
}
