import React, { useState, useEffect, useRef } from 'react'
import { XStack, styled, View, Button as TButton } from 'tamagui'
import { Search, X } from '@tamagui/lucide-icons'
import { Input } from '../ui/Input'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

/**
 * SearchBar Component - Migrated from Web to Tamagui
 * Includes a search icon, a clear button, and 300ms debounce logic.
 */
export function SearchBar({ value: externalValue, onChange }: SearchBarProps) {
    // Local state for immediate UI feedback
    const [localValue, setLocalValue] = useState(externalValue)
    const isFirstRun = useRef(true)

    // Synchronize local state with external value (e.g., when navigation clears it)
    useEffect(() => {
        if (externalValue !== localValue) {
            setLocalValue(externalValue)
        }
    }, [externalValue])

    // Debounce logic: trigger onChange after 300ms of inactivity
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }

        const handler = setTimeout(() => {
            onChange(localValue)
        }, 300)

        return () => {
            clearTimeout(handler)
        }
    }, [localValue, onChange])

    const handleClear = () => {
        setLocalValue('')
        onChange('') // Immediate clear
    }

    return (
        <XStack width="100%" position="relative" marginTop="$4">
            <Input
                placeholder="Pesquisar lugares..."
                value={localValue}
                onChangeText={setLocalValue}
                icon={<Search size={20} color="$mutedForeground" />}
                paddingRight={48} // Room for the clear button
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
            />

            {localValue.length > 0 && (
                <View
                    position="absolute"
                    right={8}
                    top={0}
                    bottom={0}
                    zIndex={30}
                    justifyContent="center"
                    alignItems="center"
                >
                    <TButton
                        size="$3"
                        circular
                        chromeless
                        backgroundColor="$secondary"
                        onPress={handleClear}
                        icon={<X size={16} color="$mutedForeground" />}
                        pressStyle={{ opacity: 0.7, scale: 0.95 }}
                    />
                </View>
            )}
        </XStack>
    )
}
