import { StorageAdapter } from 'grammy';
import IORedis from 'ioredis';

export class RedisAdapter<T> implements StorageAdapter<T> {
  private redis: IORedis.Redis

  constructor({
    redisUrl,
    instance,
    options,
  }: {
    redisUrl?: string,
    instance?: IORedis.Redis,
    options?: IORedis.RedisOptions
  }) {
    if (redisUrl) {
      const redis = new IORedis(redisUrl, options);
      this.redis = redis;
    } else if (instance) {
      this.redis = instance;
    } else {
      throw new Error('You should pass redisUrl or redis instance to constructor.');
    }

    return this;
  }

  async read(key: string) {
    const session = await this.redis.get(key);
    if (session == null) {
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
