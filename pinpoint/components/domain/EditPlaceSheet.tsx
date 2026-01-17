import React, { useEffect } from 'react'
import { ScrollView } from 'react-native'
import {
    Sheet,
    YStack,
    XStack,
    Text,
    H2,
    Separator,
    styled,
    Button as TButton,
    View
} from 'tamagui'
import { Pencil, X } from '@tamagui/lucide-icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '../ui/Input'
import { TextArea } from '../ui/TextArea'
import { Button } from '../ui/Button'
import { CATEGORIES } from '../../lib/schemas/category.schema'
import { UpdatePlaceSchema, type Place, type UpdatePlace } from '../../lib/schemas/place.schema'

interface EditPlaceSheetProps {
    place: Place | null
    isOpen: boolean
    onClose: () => void
    onSave: (updates: UpdatePlace) => void
}

/**
 * Category Chip Styled Component (Shared logic from AddPlaceSheet)
 */
const CategoryChip = styled(TButton, {
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    gap: '$2',
    borderWidth: 1.5,
    flex: 1,
    paddingHorizontal: '$2',

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

export function EditPlaceSheet({ place, isOpen, onClose, onSave }: EditPlaceSheetProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isValid }
    } = useForm<UpdatePlace>({
        resolver: zodResolver(UpdatePlaceSchema),
        defaultValues: {
            name: '',
            address: '',
            category: 'food',
            note: '',
        },
        mode: 'onChange'
    })

    // Reset form with place data when it opens or place changes
    useEffect(() => {
        if (isOpen && place) {
            reset({
                name: place.name,
                address: place.address,
                category: place.category,
                note: place.note || '',
            })
        }
    }, [isOpen, place, reset])

    const onSubmit = (data: UpdatePlace) => {
        onSave(data)
        onClose()
    }

    return (
        <Sheet
            modal
            open={isOpen}
            onOpenChange={(open: boolean) => {
                if (!open) onClose()
            }}
            snapPoints={[90]}
            dismissOnSnapToBottom
            animation="quick"
            moveOnKeyboardChange
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                backgroundColor="rgba(0,0,0,0.5)"
            />

            <Sheet.Frame backgroundColor="$background" padding="$4">
                <Sheet.Handle />

                {/* Header */}
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$4" marginTop="$2">
                    <XStack gap="$2" alignItems="center">
                        <View backgroundColor="$secondary" padding="$2" borderRadius={8}>
                            <Pencil size={20} color="$primary" />
                        </View>
                        <H2 fontSize={20} fontWeight="700">Editar Lugar</H2>
                    </XStack>
                    <Button
                        variant="ghost"
                        circular
                        size="sm"
                        icon={<X size={20} />}
                        onPress={onClose}
                    />
                </XStack>

                <Separator marginBottom="$4" />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <YStack gap="$4" paddingBottom="$8">
                        {/* Name Field */}
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Nome do Lugar *"
                                    placeholder="Ex: Torre Eiffel"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.name?.message as string | undefined}
                                />
                            )}
                        />

                        {/* Address Field */}
                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextArea
                                    label="Endereço Completo *"
                                    placeholder="Ex: Champ de Mars, 5 Av. Anatole France..."
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.address?.message as string | undefined}
                                    numberOfLines={2}
                                />
                            )}
                        />

                        {/* Category Field */}
                        <YStack gap="$2">
                            <Text fontSize={14} fontWeight="600" marginLeft="$1">Categoria</Text>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field: { onChange, value } }) => (
                                    <YStack gap="$2">
                                        {[0, 1].map((row) => (
                                            <XStack key={row} gap="$2">
                                                {CATEGORIES.slice(row * 3, (row + 1) * 3).map((cat) => (
                                                    <CategoryChip
                                                        key={cat.id}
                                                        active={value === cat.id}
                                                        onPress={() => onChange(cat.id)}
                                                    >
                                                        <Text fontSize={18}>{cat.icon}</Text>
                                                        <Text
                                                            fontSize={12}
                                                            fontWeight="600"
                                                            color={value === cat.id ? '$primaryForeground' : '$secondaryForeground'}
                                                        >
                                                            {cat.label}
                                                        </Text>
                                                    </CategoryChip>
                                                ))}
                                            </XStack>
                                        ))}
                                        {CATEGORIES.length > 6 && (
                                            <XStack gap="$2">
                                                {CATEGORIES.slice(6).map((cat) => (
                                                    <CategoryChip
                                                        key={cat.id}
                                                        active={value === cat.id}
                                                        onPress={() => onChange(cat.id)}
                                                    >
                                                        <Text fontSize={18}>{cat.icon}</Text>
                                                        <Text
                                                            fontSize={12}
                                                            fontWeight="600"
                                                            color={value === cat.id ? '$primaryForeground' : '$secondaryForeground'}
                                                        >
                                                            {cat.label}
                                                        </Text>
                                                    </CategoryChip>
                                                ))}
                                                {CATEGORIES.length % 3 !== 0 && <View flex={3 - (CATEGORIES.length % 3)} />}
                                            </XStack>
                                        )}
                                    </YStack>
                                )}
                            />
                        </YStack>

                        {/* Note Field */}
                        <Controller
                            control={control}
                            name="note"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextArea
                                    label="Nota (opcional)"
                                    placeholder="Dicas, horários ou lembretes..."
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    numberOfLines={3}
                                />
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            size="lg"
                            marginTop="$2"
                            onPress={handleSubmit(onSubmit)}
                            disabled={!isValid || !isDirty}
                            opacity={(!isValid || !isDirty) ? 0.5 : 1}
                        >
                            Salvar Alterações
                        </Button>
                    </YStack>
                </ScrollView>
            </Sheet.Frame>
        </Sheet>
    )
}
