# Redis storage adapter for grammY

Storage adapter that can be used to
[store your session data](https://grammy.dev/plugins/session.html) in
[Redis](https://redis.io/) when using sessions.

## Installation

Node

```bash
npm install @satont/grammy-redis-storage --save
```

```ts
import { RedisAdapter } from "@satont/grammy-redis-storage";
```

Deno

```ts
import { RedisAdapter } from "https://deno.land/x/grammy_redis_storage/mod.ts";
```

## Usage

You can check
[examples](https://github.com/Satont/grammy-redis-storage/tree/main/examples)
folder
