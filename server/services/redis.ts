// Redis service with InMemoryStore fallback

export const isRedisConfigured =
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

export class InMemoryStore {
    private hashes: Map<string, Map<string, string>> = new Map();
    private sets: Map<string, Set<string>> = new Map();
    private strings: Map<string, string> = new Map();

    async connect(): Promise<void> {
        console.log('Using InMemoryStore (no Redis configured)');
    }

    on(_event: string, _handler: (...args: any[]) => void): void {
        // no-op: InMemoryStore has no connection events
    }

    async exists(key: string): Promise<number> {
        const hasHash = this.hashes.has(key);
        const hasString = this.strings.has(key);
        const hasSet = this.sets.has(key);
        return hasHash || hasString || hasSet ? 1 : 0;
    }

    async hSet(key: string, fieldOrObject: string | Record<string, string>, value?: string): Promise<number> {
        if (!this.hashes.has(key)) {
            this.hashes.set(key, new Map());
        }
        const hash = this.hashes.get(key)!;
        if (typeof fieldOrObject === 'object') {
            let count = 0;
            for (const [f, v] of Object.entries(fieldOrObject)) {
                if (!hash.has(f)) count++;
                hash.set(f, String(v));
            }
            return count;
        } else {
            const isNew = !hash.has(fieldOrObject);
            hash.set(fieldOrObject, String(value));
            return isNew ? 1 : 0;
        }
    }

    async hGet(key: string, field: string): Promise<string | null> {
        return this.hashes.get(key)?.get(field) ?? null;
    }

    async hGetAll(key: string): Promise<Record<string, string>> {
        const hash = this.hashes.get(key);
        if (!hash) return {};
        return Object.fromEntries(hash.entries());
    }

    async hDel(key: string, field: string): Promise<number> {
        const hash = this.hashes.get(key);
        if (!hash) return 0;
        return hash.delete(field) ? 1 : 0;
    }

    async hLen(key: string): Promise<number> {
        return this.hashes.get(key)?.size ?? 0;
    }

    async del(key: string): Promise<number> {
        let count = 0;
        if (this.hashes.delete(key)) count++;
        if (this.strings.delete(key)) count++;
        if (this.sets.delete(key)) count++;
        return count;
    }

    async sAdd(key: string, member: string): Promise<number> {
        if (!this.sets.has(key)) {
            this.sets.set(key, new Set());
        }
        const set = this.sets.get(key)!;
        const isNew = !set.has(member);
        set.add(member);
        return isNew ? 1 : 0;
    }

    async sMembers(key: string): Promise<string[]> {
        return Array.from(this.sets.get(key) ?? []);
    }

    async sRem(key: string, member: string): Promise<number> {
        const set = this.sets.get(key);
        if (!set) return 0;
        return set.delete(member) ? 1 : 0;
    }
}
