import { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useTestStore } from '../lib/storage/test-store';
import { storage } from '../lib/storage/universal-storage';

export default function Home() {
    const { testValue, counter, setTestValue, incrementCounter, reset } = useTestStore();
    const [inputValue, setInputValue] = useState('');
    const [storageType, setStorageType] = useState('...');

    useEffect(() => {
        // Detect storage type from logs
        const detectStorage = () => {
            if (Platform.OS === 'web') {
                setStorageType('localStorage');
            } else {
                // Check if MMKV actually works
                try {
                    const { MMKV } = require('react-native-mmkv');
                    const testInstance = new MMKV();
                    testInstance.set('__ui_test__', 'test');
                    const testValue = testInstance.getString('__ui_test__');
                    testInstance.delete('__ui_test__');

                    if (testValue === 'test') {
                        setStorageType('MMKV (Production)');
                    } else {
                        setStorageType('AsyncStorage (Expo Go)');
                    }
                } catch {
                    setStorageType('AsyncStorage (Expo Go)');
                }
            }
        };
        detectStorage();
    }, []);

    const handleSave = () => {
        setTestValue(inputValue);
        setInputValue('');
    };

    const handleDirectTest = () => {
        storage.set('direct-test', `Test at ${new Date().toISOString()}`);
        const value = storage.getString('direct-test');
        alert(`Direct storage test: ${value}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📍 Pinpoint Universal App</Text>
            <Text style={styles.subtitle}>
                Storage Test ({storageType})
            </Text>

            <View style={styles.section}>
                <Text style={styles.label}>Zustand Persist Test:</Text>
                <Text style={styles.value}>Saved Value: {testValue || '(empty)'}</Text>
                <Text style={styles.value}>Counter: {counter}</Text>

                <TextInput
                    style={styles.input}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder="Enter test value"
                    placeholderTextColor="#999"
                />

                <View style={styles.buttonRow}>
                    <Pressable style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={incrementCounter}>
                        <Text style={styles.buttonText}>Count +1</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.buttonDanger]} onPress={reset}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.section}>
                <Pressable style={styles.button} onPress={handleDirectTest}>
                    <Text style={styles.buttonText}>Test Direct Storage</Text>
                </Pressable>
            </View>

            <Text style={styles.instruction}>
                💡 Close and reopen the app to verify persistence
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    section: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    value: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDanger: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    instruction: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
