export interface SubmitWordData {
  word: string;
}

export interface StartGameData {
  rounds?: number; // default = 3 on backend
}

export interface GameStartPayload {
  baseSentence: string;
  totalRounds: number;
  players: string[]; // UUID[]
}

export interface TurnStartPayload {
  activePlayerId: string; // UUID
  currentRound: number;
  baseSentence: string;
}

export interface WordResultPayload {
  success: boolean;
  word: string;
  pointsGained: number;
  message: string;
  updatedScores: Record<string, number>; // Map<UUID, Int>
}

export interface PlayerPassedPayload {
  playerId: string; // UUID
}

export interface EndRoundPayload {
  winnerId?: string | null; // UUID?
  scores: Record<string, number>;
}

export interface GameOverPayload {
  winnerId?: string | null; // UUID?
  finalScores: Record<string, number>;
}