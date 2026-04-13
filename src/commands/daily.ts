import { Composer, InputFile } from "grammy";

import { db } from "../config/db";
import { redis } from "../config/redis";
import { CommandsHelper } from "../util/commands-helper";
import { dailyGameGuards, runGuards } from "../util/guards";
import { generateWordleImage } from "../handlers/on-message";
import {
  ensureDailyWordExists,
  getCurrentGameDateString,
} from "../services/daily-wordle-cron";

const composer = new Composer();

composer.command("daily", async (ctx) => {
  if (!ctx.from) return;

  try {
    const guard = await runGuards(ctx, dailyGameGuards);
    if (!guard.ok) return ctx.reply(guard.message);

    const userId = ctx.from.id.toString();

    const gameDate = getCurrentGameDateString();
    const dailyWord = await ensureDailyWordExists(gameDate);

    if (!dailyWord) {
      return ctx.reply(
        "Today's WordXGuessing is not ready yet due to a server issue. Please try again in a few moments!",
      );
    }

    await db
      .insertInto("userStats")
      .values({
        userId,
        highestStreak: 0,
        currentStreak: 0,
        lastGuessed: null,
      })
      .onConflict((oc) => oc.column("userId").doNothing())
      .execute();

    const existingGuesses = await db
      .selectFrom("dailyGuesses")
      .selectAll()
      .where("userId", "=", userId)
      .where("dailyWordId", "=", dailyWord.id)
      .execute();

    if (existingGuesses.length > 0) {
      const lastGuess = existingGuesses[existingGuesses.length - 1];

      if (lastGuess.guess === dailyWord.word) {
        return ctx.reply(
          `You've already completed today's WordXGuessing! You got it in ${existingGuesses.length} ${existingGuesses.length === 1 ? "try" : "tries"}. Come back after 6:00 AM tomorrow for a new challenge!`,
        );
      }

      if (existingGuesses.length >= 6) {
        return ctx.reply(
          `You've already used all 6 attempts for today's WordXGuessing. The word was: ${dailyWord.word.toUpperCase()}\n\nCome back after 6:00 AM tomorrow for a new challenge!`,
        );
      }
    }

    await redis.setex(
      `daily_wordle:${userId}`,
      86400,
      JSON.stringify({
        dailyWordId: dailyWord.id,
        date: gameDate,
        startedAt: new Date().toISOString(),
      }),
    );

    const attemptsUsed = existingGuesses.length;
    const attemptsLeft = 6 - attemptsUsed;

    if (attemptsUsed > 0) {
      const imageBuffer = await generateWordleImage(
        existingGuesses,
        dailyWord.word,
      );

      return ctx.replyWithPhoto(new InputFile(imageBuffer), {
        caption: `Welcome back! You have ${attemptsLeft} ${attemptsLeft === 1 ? "attempt" : "attempts"} left for today's WordXGuessing. Keep guessing!`,
      });
    }

    return ctx.reply(
      "🎯 WordXGuessing of the Day started! Guess the 5-letter word. You have 6 attempts. Good luck!",
    );
  } catch (error) {
    console.error("Error starting daily wordle:", error);
    ctx.reply("Something went wrong. Please try again.");
  }
});

CommandsHelper.addNewCommand("daily", "Play WordXGuessing of the Day (DM only)");

composer.command("pausedaily", async (ctx) => {
  if (!ctx.from) return;

  try {
    const userId = ctx.from.id.toString();

    const dailyGameData = await redis.get(`daily_wordle:${userId}`);

    if (!dailyGameData) {
      return ctx.reply(
        "You don't have an active WordXGuessing of the Day game to pause.",
      );
    }

    await redis.del(`daily_wordle:${userId}`);

    return ctx.reply(
      "✅ Your WordXGuessing of the Day game has been paused. You can now play regular WordXGuessing.\n\nTo play today's WordXGuessing again, use /daily (your previous attempts will still count).",
    );
  } catch (error) {
    console.error("Error pausing daily wordle:", error);
    ctx.reply("Something went wrong. Please try again.");
  }
});

CommandsHelper.addNewCommand("pausedaily", "Pause WordXGuessing of the Day game");

export const dailyWordleCommand = composer;
