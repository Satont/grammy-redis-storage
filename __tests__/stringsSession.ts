import { session } from 'grammy';
import { RedisAdapter } from '../src';

import Redis from 'ioredis-mock';
import { createBot } from './helpers/createBot';
import { createMessage } from './helpers/createMessage';

const redis: Redis.Redis = new Redis();
const storage: RedisAdapter<string> = new RedisAdapter({ instance: redis });

test('bot should be created', () => {
  expect(createBot()).not.toBeFalsy();
});

test('Redis is mocked', async () => {
  await redis.set('TESTKEY', 'TESTVALUE');
  expect(await redis.get('TESTKEY')).toBe('TESTVALUE');
});

describe('Test string session', () => {
  test('Initial session state should equals "test"', async () => {
    const bot = createBot<string>();
    const ctx = createMessage(bot);
    bot.use(session({
      initial() {
        return 'test';
      },
      storage,
    }));

    await bot.handleUpdate(ctx.update);

    bot.on('msg:text', (ctx) => {
      expect(ctx.session).toEqual(test);
    });
  });

  test('Session state should be changed to "testqwe" after message', async () => {
    const bot = createBot<string>();

    bot.use(session({
      initial() {
        return 'test';
      },
      storage,
    }));

    
    bot.hears('first', (ctx) => {
      expect(ctx.session).toEqual('test');
      ctx.session = ctx.session + 'qwe';
    });

    bot.hears('second', (ctx) => {
      expect(ctx.session).toEqual('testqwe');
    });

    await bot.handleUpdate(createMessage(bot, 'first').update);
    await bot.handleUpdate(createMessage(bot, 'second').update);
  });
});
