import { Composer } from "grammy";

import { endWordCommand } from "./endWord";
import { helpCommand } from "./help";
import { WordAuthCommand } from "./Wordauth";
import { leaderboardCommand } from "./leaderboard";
import { myscoreCommand } from "./myscore";
import { newWordCommand } from "./newWord";
import { scoreCommand } from "./score";
import { setGameTopicCommand } from "./setgametopic";
import { statsCommand } from "./stats";
import { suggestWordCommand } from "./suggestword";
import { unsetGameTopicCommand } from "./unsetgametopic";

const composer = new Composer();

composer.use(
  helpCommand,
  newWordCommand,
  endWordCommand,
  leaderboardCommand,
  myscoreCommand,
  setGameTopicCommand,
  unsetGameTopicCommand,
  statsCommand,
  suggestWordCommand,
  scoreCommand,
  WordAuthCommand,
);

export const commands = composer;
