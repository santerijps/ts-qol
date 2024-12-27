export type Result<T, E extends Error = Error> = [T, null] | [null, E];

export const success = <T>(value: T): [T, null] => {
    return [value, null];
};

export const failure = <E extends Error>(error: E): [null, E] => {
    return [null, error];
};

export const catchAsync = async <T, E extends Error = Error>(
    promise: Promise<T>,
): Promise<Result<T, E>> => {
    try {
        return [await promise, null];
    } catch (error) {
        return [null, error as E];
    }
};

export const catchSync = <T, E extends Error = Error>(
    getter: () => T,
): Result<T, E> => {
    try {
        return [getter(), null];
    } catch (error) {
        return [null, error as E];
    }
};

export const handleAsync = async <T, E extends Error = Error>(
    promise: Promise<T>,
    handler: (error: E) => T,
): Promise<T> => {
    try {
        return await promise;
    } catch (error) {
        return handler(error as E);
    }
};

export const handleSync = <T, E extends Error = Error>(
    getter: () => T,
    handler: (error: E) => T,
): T => {
    try {
        return getter();
    } catch (error) {
        return handler(error as E);
    }
};

export const unwrapAsync = async <T, E extends Error = Error>(
    promise: Promise<Result<T, E>>,
    handler: (error: E) => T,
): Promise<T> => {
    const [value, error] = await promise;
    if (error) {
        return handler(error);
    }
    return value as T;
};

export const unwrapSync = <T, E extends Error = Error>(
    getter: () => Result<T, E>,
    handler: (error: E) => T,
): T => {
    const [value, error] = getter();
    if (error) {
        return handler(error);
    }
    return value as T;
};

export default {
    success,
    failure,

    catchAsync,
    catchSync,

    handleAsync,
    handleSync,

    unwrapAsync,
    unwrapSync,
};
