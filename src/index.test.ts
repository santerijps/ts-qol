import index, { Result } from ".";

test(index.success.name, () => {
    const [data, error] = index.success(123);
    expect(data).toBe(123);
    expect(error).toBeNull();
});
test(index.failure.name, () => {
    const [data, error] = index.failure(new Error("123"));
    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("123");
});

describe(index.catchAsync.name, () => {
    test("happy case", async () => {
        const [data, error] = await index.catchAsync(new Promise<number>((resolve) => resolve(123)));
        expect(data).toBe(123);
        expect(error).toBeNull();
    });
    test("sad case", async () => {
        const [data, error] = await index.catchAsync(new Promise<number>((resolve, reject) => reject(new Error("123"))));
        expect(data).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe("123");
    });
});

describe(index.catchSync.name, () => {
    test("happy case", () => {
        const [data, error] = index.catchSync(() => 123);
        expect(data).toBe(123);
        expect(error).toBeNull();
    });
    test("sad case", () => {
        const [data, error] = index.catchSync(() => { throw new Error("123") });
        expect(data).toBeNull;
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe("123");
    });
});

describe(index.handleAsync.name, () => {
    test("happy case", async () => {
        const data = await index.handleAsync(new Promise<number>((resolve) => resolve(123)), () => -1);
        expect(data).toBe(123);
    });
    test("sad case", async () => {
        const data = await index.handleAsync(new Promise<number>((resolve, reject) => reject(new Error("123"))), () => -1);
        expect(data).toBe(-1);
    });
});

describe(index.handleSync.name, () => {
    test("happy case", () => {
        const data = index.handleSync(() => 123, () => -1);
        expect(data).toBe(123);
    });
    test("sad case", () => {
        const data = index.handleSync(() => { throw new Error("123") }, () => -1);
        expect(data).toBe(-1);
    });
});

describe(index.unwrapAsync.name, () => {
    test("happy case", async () => {
        const data = await index.unwrapAsync(new Promise<Result<number>>((resolve) => resolve(index.catchSync(() => 123))), () => -1);
        expect(data).toBe(123);
    });
    test("sad case", async () => {
        const task = async () => {
            return index.catchSync(() => {
                throw new Error("123");
                return 123;
            });
        };
        const data = await index.unwrapAsync(task(), () => -1);
        expect(data).toBe(-1);
    });
});

describe(index.unwrapSync.name, () => {
    test("happy case", () => {
        const data = index.unwrapSync(() => index.catchSync(() => 123), () => -1);
        expect(data).toBe(123);
    });
    test("sad case", () => {
        const data = index.unwrapSync(() => index.catchSync(() => { throw new Error("123") }), () => -1);
        expect(data).toBe(-1);
    });
});