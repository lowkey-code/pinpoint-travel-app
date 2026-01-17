import { useErrorsStore, AppError } from './stores/errors.store';

export interface LogErrorOptions {
    source?: 'javascript' | 'promise' | 'react' | 'app';
    context?: Record<string, unknown>;
}

class ErrorLogger {
    private static instance: ErrorLogger;

    private constructor() {
        this.setupGlobalErrorHandlers();
    }

    static getInstance(): ErrorLogger {
        if (!ErrorLogger.instance) {
            ErrorLogger.instance = new ErrorLogger();
        }
        return ErrorLogger.instance;
    }

    private setupGlobalErrorHandlers() {
        if (typeof window !== 'undefined') {
            window.addEventListener('error', (event) => {
                this.logError(
                    event.error || new Error(event.message),
                    { source: 'javascript', context: { filename: event.filename, lineno: event.lineno } }
                );
            });

            window.addEventListener('unhandledrejection', (event) => {
                this.logError(
                    event.reason instanceof Error
                        ? event.reason
                        : new Error(String(event.reason)),
                    { source: 'promise' }
                );
            });
        }
    }

    logError(error: Error | string, options: LogErrorOptions = {}): void {
        const { source = 'app', context } = options;

        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;

        const appError: AppError = {
            id: '',
            message: errorMessage,
            stack: errorStack,
            source,
            timestamp: new Date(),
            context,
        };

        useErrorsStore.getState().addError(appError);

        console.error(`[ErrorLogger][${source}]`, {
            message: errorMessage,
            stack: errorStack,
            context,
        });
    }

    logReactError(error: Error, errorInfo: { componentStack: string }): void {
        this.logError(error, {
            source: 'react',
            context: { componentStack: errorInfo.componentStack },
        });
    }
}

export const errorLogger = ErrorLogger.getInstance();
