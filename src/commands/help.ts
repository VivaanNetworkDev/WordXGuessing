import { Composer } from "grammy";

import { CommandsHelper } from "../util/commands-helper";

const composer = new Composer();

composer.command("help", (ctx) =>
  ctx.reply(
    `<blockquote>🎯 WordXGuessing 🎯</blockquote>

🤖 <i>AI-Powered Word Guessing Challenge</i>

Welcome to WordXGuessing - the ultimate word guessing game where our AI gives you clever hints and you race to discover the hidden word!

🎮 <b>How to Play:</b>
- The AI will provide you with creative hints
- Use your detective skills to guess the correct word
- Challenge yourself across different difficulty levels
- Track your progress and compete on the leaderboard

🚀 <b>Start Playing:</b>
<code>/newWord</code> - Interactive mode selection
<code>/newWord easy</code> - Beginner friendly
<code>/newWord medium</code> - Standard challenge
<code>/newWord hard</code> - Advanced level
<code>/newWord extreme</code> - Expert mode
<code>/newWord random</code> - Surprise difficulty!

⚡ <b>Game Controls:</b>
<code>/endWord</code> - End current game
<code>/help</code> - Show this help message

🎲 <b>Group Settings:</b>
<code>/setgametopic</code> - Set a topic for group games
<code>/unsetgametopic</code> - Remove topic filter

🛂 <b>Authorization for ending game</b>
<code>/Wordauth @username</code> - Mention a user
<code>/Wordauth 123456789</code> - Use user ID
<code>/Wordauth list</code> - Show authorized users
<code>/Wordauth remove @username</code> - Remove authorization

📊 <b>Your Progress:</b>
<code>/score</code> - View your score or check another player's stats
  • <code>/score</code> - View your own score
  • <code>/score @username|user_id</code> - View another player's score
  • <code>/score global</code> - View global rankings
  • <code>/score week</code> - Filter by time period
  • Mix filters: <code>/score @user global month</code>

<code>/leaderboard</code> - See top players
<code>/stats</code> - View bot statistics (Admin only)

💡 <b>Want to suggest a word?</b>
<code>/suggestword</code> - Suggest a word which doesn't exist in our database.

Ready to test your word skills? Type <code>/newWord</code> to begin! 🧠✨`,
    { parse_mode: "HTML" },
  ),
);

CommandsHelper.addNewCommand(
  "help",
  "Get help on how to play and commands list.",
);

export const helpCommand = composer;
