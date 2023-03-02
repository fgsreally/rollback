import { expect, test, vi } from 'vitest';
import { scope } from "../src";

function stop<A>(args: A, isResolve = true) {
    return new Promise<A>((res, rej) => {
        if (!isResolve) rej(args)
        res(args)
    })
}



test('rollback in scope', async () => {

    const rollback = vi.fn(() => { })
    const fn = vi.fn(() => { })

    expect(await scope(async (r) => {

    })).toBeUndefined()

    expect(await scope(async (r) => {
        await r(() => true, rollback)

        await r(() => stop(true), rollback)
        fn()
        await r(() => { throw new Error(`error`) }, rollback)

        fn()

    })).toHaveProperty("message", "error");
    expect(fn).toHaveBeenCalledTimes(1)

    expect(rollback).toHaveBeenCalledTimes(2)

    expect(await scope(async (r) => {
        fn()

        await r(() => stop(true, false), rollback)

        fn()
    })).toBeTruthy()
    expect(fn).toHaveBeenCalledTimes(2)

    expect(rollback).toHaveBeenCalledTimes(2)


})