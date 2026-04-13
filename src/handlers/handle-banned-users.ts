import { Composer, InlineKeyboard } from "grammy";

import { db } from "../config/db";

const composer = new Composer();

const BAN_CACHE_TTL_MS = 60_000;
const banCache = new Map<string, { isBanned: boolean; expiresAt: number }>();

composer.on("message", async (ctx, next) => {
  if (!ctx.from || !ctx.chat) return await next();

  const text = ctx.message.text?.trim() ?? "";
  const botMentioned =
    ctx.message.reply_to_message?.from?.id.toString() === ctx.me.id.toString();
  const shouldCheckBan =
    ctx.chat.type === "private" ||
    botMentioned ||
    text.startsWith("/") ||
    /^[a-z]{4,6}$/i.test(text);

  if (!shouldCheckBan) return await next();

  const userId = ctx.from.id.toString();
  const cachedBan = banCache.get(userId);
  let isUserBanned = cachedBan?.isBanned;

  if (!cachedBan || cachedBan.expiresAt <= Date.now()) {
    const bannedUser = await db
      .selectFrom("bannedUsers")
      .select("userId")
      .where("userId", "=", userId)
      .executeTakeFirst();

    isUserBanned = !!bannedUser;
    banCache.set(userId, {
      isBanned: isUserBanned,
      expiresAt: Date.now() + BAN_CACHE_TTL_MS,
    });
  }

  if (!isUserBanned) return await next();

  const keyboard = new InlineKeyboard();
  keyboard.url("Appeal", "t.me/IFlexElite").primary();
  const banMessage =
    "⚠️ You have been banned from bot for cheating using automated scripts!";

  if (ctx.chat.type === "private") {
    return ctx.reply(banMessage, {
      reply_markup: keyboard,
    });
  } else {
    if (botMentioned) {
      return ctx.reply(banMessage, {
        reply_markup: keyboard,
      });
    }
  }
});

export const handleBannedUsers = composer;
