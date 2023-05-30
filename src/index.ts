class Controller {
    stacks: Function[] = []
    isActive: boolean = false

    async run(fn: Function) {
        try {
            this.isActive = true
            await fn(this.r.bind(this))
        } catch (e) {
            return e
        } finally {
            this.isActive = false
            this.stacks = []
        }

    }
    async add(fn: Function, rollback: Function) {
        try {

            let ret = await fn()
            this.stacks.unshift(rollback)

            return ret
        } catch (e: any) {
            await this.rollback(e)
            throw e
        }
    }
    async rollback(e: Error) {
        for (let fn of this.stacks) {
            await fn(e)
        }
    }
    async  r<C extends (...args: any) => Promise<any> | any>(fn: C, rollback: (args: Error) => any=()=>{}): Promise<Awaited<ReturnType<C>> > {

        if (this.isActive) {
            return this.add(fn, rollback)
    
        } else {
            try {
                return await fn()
            } catch (e) {
                await rollback(e as any)
                return undefined as any
            }
    
        }
    }
}


export async function scope<C extends (rollback: Controller['r']) => Promise<any>>(fn: C): Promise<Error> {
    let controller = new Controller()
    return  controller.run(fn)as unknown as Error
}

