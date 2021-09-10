import { session } from 'grammy';
import { RedisAdapter } from '../src';

import Redis from 'ioredis-mock';
import { createBot } from './helpers/createBot';
import { createMessage } from './helpers/createMessage';

const redis: Redis.Redis = new Redis();
const storage: RedisAdapter<SessionData> = new RedisAdapter({ instance: redis });

export interface SessionData {
  pizzaCount: number;
}

test('bot should be created', () => {
  expect(createBot()).not.toBeFalsy();
});

test('Redis is mocked', async () => {
  await redis.set('TESTKEY', 'TESTVALUE');
  expect(await redis.get('TESTKEY')).toBe('TESTVALUE');
});

describe('Pizza counter test', () => {
  test('Pizza counter should be equals 0 on initial', async () => {
    const bot = createBot<SessionData>();
    const ctx = createMessage(bot);
    bot.use(session({
      initial() {
        return { pizzaCount: 0 };
      },
      storage,
    }));

    await bot.handleUpdate(ctx.update);

    bot.on('msg:text', (ctx) => {
      expect(ctx.session.pizzaCount).toEqual(0);
    });
  });

  test('Pizza counter should be equals 1 after first message', async () => {
    const bot = createBot<SessionData>();

    bot.use(session({
      initial: () => ({ pizzaCount: 0 }),
      storage,
    }));

    bot.hears('first', (ctx) => {
      ctx.session.pizzaCount = Number(ctx.session.pizzaCount) + 1;
    });
    
    bot.hears('second', (ctx) => {
      expect(ctx.session.pizzaCount).toEqual(1);
    });
    
    const firstMessage = createMessage(bot, 'first');
    const secondMessage = createMessage(bot, 'second');

    await bot.handleUpdate(firstMessage.update);
    await bot.handleUpdate(secondMessage.update);
  });
});
