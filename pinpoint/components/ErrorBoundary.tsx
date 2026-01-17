import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { errorLogger } from '../lib/errorLogger';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        errorLogger.logReactError(error, { componentStack: errorInfo.componentStack });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 16,
                        backgroundColor: '#fff5f5',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#000',
                            marginBottom: 8,
                            textAlign: 'center',
                        }}
                    >
                        Algo deu errado
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#666',
                            textAlign: 'center',
                            marginBottom: 16,
                        }}
                    >
                        Ocorreu um erro inesperado. Por favor, tente recarregar a aplicação.
                    </Text>
                    {this.state.error && (
                        <Text
                            style={{
                                fontSize: 12,
                                color: '#999',
                                fontFamily: 'monospace',
                                marginBottom: 12,
                                textAlign: 'center',
                            }}
                        >
                            {this.state.error.message}
                        </Text>
                    )}
                </View>
            );
        }

        return this.props.children;
    }
}
