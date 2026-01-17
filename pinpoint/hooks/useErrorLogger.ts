import { useCallback } from 'react';
import { errorLogger, LogErrorOptions } from '../lib/errorLogger';
import { useErrorsStore } from '../lib/stores/errors.store';

export const useErrorLogger = () => {
    const { errors, clearErrors, removeError } = useErrorsStore();

    const logError = useCallback(
        (error: Error | string, options?: LogErrorOptions) => {
            errorLogger.logError(error, options);
        },
        []
    );

    return {
        logError,
        errors,
        clearErrors,
        removeError,
        errorCount: errors.length,
    };
};
