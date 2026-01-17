import React, { useState } from 'react'
import { Platform } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking'
import {
    XStack,
    YStack,
    Text,
    H3,
    Paragraph,
    Sheet,
    Separator,
    View
} from 'tamagui'
import {
    MoreVertical,
    Copy,
    Navigation,
    Trash2,
    Pencil,
    Check,
    X
} from '@tamagui/lucide-icons'

import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { CATEGORIES } from '../../lib/schemas/category.schema'
import type { Place } from '../../lib/schemas/place.schema'

interface PlaceCardProps {
    place: Place
    onDelete: (id: string) => void
    onEdit: (place: Place) => void
}

/**
 * PlaceCard Component - Migrated from Web to Tamagui
 * Displays place details with actions for copying, navigating, and managing data.
 */
export function PlaceCard({ place, onDelete, onEdit }: PlaceCardProps) {
    const [copied, setCopied] = useState(false)
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)

    const category = CATEGORIES.find((c) => c.id === place.category)

    const copyAddress = async () => {
        try {
            await Clipboard.setStringAsync(place.address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy address:', err)
        }
    }

    const openInAMap = () => {
        // AMap (Gaode) URL with address search for Pinpoint
        const encodedAddress = encodeURIComponent(place.address)
        const amapUrl = `https://uri.amap.com/search?keyword=${encodedAddress}&src=pinpoint`
        Linking.openURL(amapUrl).catch((err) => {
            console.error('Failed to open AMap:', err)
        })
    }

    const handleDelete = () => {
        setIsOptionsOpen(false)
        onDelete(place.id)
    }

    const handleEdit = () => {
        setIsOptionsOpen(false)
        onEdit(place)
    }

    return (
        <>
            <Card pressable>
                <YStack gap="$3">
                    {/* Header Row */}
                    <XStack justifyContent="space-between" alignItems="flex-start" gap="$2">
                        <YStack flex={1} minWidth={0} gap="$1">
                            <XStack alignItems="center" gap="$2">
                                {category && (
                                    <Text fontSize={20}>{category.icon}</Text>
                                )}
                                <H3 fontSize={19} fontWeight="800" color="$foreground" numberOfLines={1}>
                                    {place.name}
                                </H3>
                            </XStack>
                            <Text fontSize={14} color="$mutedForeground" numberOfLines={2}>
                                {place.address}
                            </Text>
                        </YStack>

                        <Button
                            size="sm"
                            variant="secondary"
                            borderRadius={10}
                            width={40}
                            height={40}
                            onPress={() => setIsOptionsOpen(true)}
                            icon={<MoreVertical size={20} color="$mutedForeground" />}
                        />
                    </XStack>

                    {/* Note Section */}
                    {place.note && (
                        <Paragraph fontSize={13} color="$mutedForeground" fontStyle="italic" numberOfLines={1} opacity={0.8}>
                            💬 {place.note}
                        </Paragraph>
                    )}

                    {/* Action Buttons Row */}
                    <XStack gap="$2" marginTop="$2">
                        <Button
                            flex={1}
                            size="md"
                            variant="secondary"
                            borderRadius={12}
                            onPress={copyAddress}
                            iconLeft={copied ? <Check size={18} color="$success" /> : <Copy size={18} />}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>

                        <Button
                            flex={1}
                            size="md"
                            variant="default"
                            borderRadius={12}
                            onPress={openInAMap}
                            iconLeft={<Navigation size={18} />}
                        >
                            Open AMap
                        </Button>
                    </XStack>
                </YStack>
            </Card>

            {/* Options Sheet (ActionSheet replacement) */}
            <Sheet
                modal
                open={isOptionsOpen}
                onOpenChange={setIsOptionsOpen}
                snapPoints={[25]}
                dismissOnSnapToBottom
                animation="quick"
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                    backgroundColor="rgba(0,0,0,0.5)"
                />
                <Sheet.Frame padding="$4" backgroundColor="$background">
                    <Sheet.Handle />
                    <YStack gap="$2" marginTop="$2">
                        <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                            <H3 fontSize={16}>Place Options</H3>
                            <Button
                                size="sm"
                                variant="ghost"
                                borderRadius={10}
                                onPress={() => setIsOptionsOpen(false)}
                                icon={<X size={18} />}
                            />
                        </XStack>

                        <Separator />

                        <Button
                            variant="ghost"
                            justifyContent="flex-start"
                            onPress={handleEdit}
                            iconLeft={<Pencil size={18} />}
                        >
                            Edit Place
                        </Button>

                        <Button
                            variant="ghost"
                            justifyContent="flex-start"
                            onPress={handleDelete}
                            color="$destructive"
                            iconLeft={<Trash2 size={18} color="$destructive" />}
                        >
                            Delete Place
                        </Button>
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}
