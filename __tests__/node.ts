import { Bot, Context, SessionFlavor, session } from 'grammy';
import { RedisAdapter } from '../dist/mod';
import { RedisMock } from './redisMock'

interface SessionData {
  pizzaCount: number;
}


test('Pizza counter tests', async () => {
  const bot = createBot<SessionData>();

  bot.use(session({
    initial: () => ({ pizzaCount: 0 }),
    storage: new RedisAdapter({ instance: new RedisMock() as any }),
  }));

  bot.hears('first', (ctx) => {
    expect(ctx.session.pizzaCount).toEqual(0)
    ctx.session.pizzaCount = Number(ctx.session.pizzaCount) + 1;
  });
  
  bot.hears('second', (ctx) => {
    expect(ctx.session.pizzaCount).toEqual(1);
  });
  
  await bot.handleUpdate(createMessage(bot, 'first').update);
  await bot.handleUpdate(createMessage(bot, 'second').update);
})
 

test('Simple string tests', async () => {
  interface StringSessionFlavor {
    get session(): string;
    set session(session: string | null | undefined);
}

  const bot = new Bot<Context & StringSessionFlavor>('fake-token', { 
    botInfo: {
      id: 42,
      first_name: 'Test Bot',
      is_bot: true,
      username: 'bot',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    },
  });;

  bot.use(session({
    initial: () => 'test',
    storage: new RedisAdapter({ instance: new RedisMock() as any }),
  }));

  bot.hears('first', async (ctx) => {
    ctx.session = `${ctx.session} edited`;
  });
  
  bot.hears('second', async (ctx) => {
    expect(ctx.session).toEqual('test edited');
  });
  
  await bot.handleUpdate(createMessage(bot, 'first').update);
  await bot.handleUpdate(createMessage(bot, 'second').update);
})

function createBot<T>(token = 'fake-token') {
  return new Bot<Context & SessionFlavor<T>>(token, { 
    botInfo: {
      id: 42,
      first_name: 'Test Bot',
      is_bot: true,
      username: 'bot',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    },
  });
}

function createMessage(bot: Bot<any>, text = 'Test Text') {
  const createRandomNumber = () => Math.floor(Math.random() * (123456789 - 1) + 1);

  const ctx = new Context({ 
    update_id: createRandomNumber(), 
    message: { 
      text,
      message_id: createRandomNumber(),
      chat: { 
        id: 1,
        type: 'private',
        first_name: 'Test User',
      },
      date: Date.now(),
    },
  }, 
  bot.api, 
  bot.botInfo
  );

  return ctx;
}