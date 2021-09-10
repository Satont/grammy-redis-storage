# Redis storage adapter for grammY

Storage adapter that can be used to [store your session data](https://grammy.dev/plugins/session.html) in [Redis](https://redis.io/) when using sessions.

## Installation

```bash
npm install @satont/grammy-redis-storage --save
```

## Introduction

You can check [examples](https://github.com/Satont/grammy-redis-storage/tree/main/examples) folder, or simple use followed code:

```ts
import { Bot, Context, session, SessionFlavor } from "grammy";
import { RedisAdapter } from "@satont/grammy-redis-storage";

// write session types
interface SessionData {
  counter: number;
}


// create context for grammy instance
type MyContext = Context & SessionFlavor<SessionData>;

// create storage
// alternatives you can pass redis connection inside of class, for example check examples folder
const storage = new RedisAdapter({ redisUrl: 'redis://localhost:6379/0' })

// Create bot and register session middleware
const bot = new Bot<MyContext>("");
bot.use(
  session({
    initial: () => ({ counter: 0 }),
    storage,
  })
);

// Register your usual middleware, and start the bot
bot.command("stats", (ctx) =>
  ctx.reply(`Already got ${ctx.session.counter} photos!`)
);
bot.on(":photo", (ctx) => ctx.session.counter++);

bot.start();
```
