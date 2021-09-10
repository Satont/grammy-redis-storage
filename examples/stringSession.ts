import { Bot, Context, session, SessionFlavor } from "grammy";
import { RedisAdapter } from "@satont/grammy-redis-storage";

type SessionData = string
type MyContext = Context & SessionFlavor<SessionData>;

//create storage
const storage = new RedisAdapter({ redisUrl: 'redis://localhost:6379/0' })

// Create bot and register session middleware
const bot = new Bot<MyContext>("");
bot.use(
  session({
    initial: () => ('initial state'),
    storage,
  })
);

// Register your usual middleware, and start the bot
bot.command("sessionData", (ctx) =>
  ctx.reply(`Current session data is  ${ctx.session}!`)
);

bot.start();