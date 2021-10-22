import { Client, StorageAdapter } from './deps.deno.ts'

export class RedisAdapter<T> implements StorageAdapter<T> {
  private redis: Client

  constructor({
    instance,
  }: {
    instance?: Client,
  }) {
    if (instance) {
      this.redis = instance;
    } else {
      throw new Error('You should pass redis instance to constructor.');
    }

    return this;
  }

  async read(key: string) {
    const session = await this.redis.get(key);
    if (session === null || session === undefined) {
      return undefined;
    }
    return JSON.parse(session) as unknown as T;
  }

  async write(key: string, value: T) {
    await this.redis.set(key, JSON.stringify(value));
  }

  async delete(key: string) {
    await this.redis.del(key);
  }
}
