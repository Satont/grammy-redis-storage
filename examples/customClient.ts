import { Bot, Context, session, SessionFlavor } from "grammy";
import { RedisAdapter } from "@satont/grammy-redis-storage";
import IORedis from 'ioredis'

interface SessionData {
  counter: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

// create redis instance
const redisInstance = IORedis()

//create storage
const storage = new RedisAdapter({ instance: redisInstance })

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