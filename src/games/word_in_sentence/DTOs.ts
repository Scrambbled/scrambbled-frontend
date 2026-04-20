export interface SubmitWordData {
  word: string;
}

export interface StartGameData {
  rounds?: number; // defaults on backend
}

export interface StartRoundPayload {
  round: number;
}

export interface GameStartedPayload {
  currentPool: string;
  totalRounds: number;
  players: string[];
  mode: string;
}

export interface TurnStartPayload {
  activePlayerId: string;
  currentRound: number;
  currentPool: string;
}

export interface WordResultPayload {
  success: boolean;
  word: string;
  pointsGained: number;
  message: string;
  updatedScores: Record<string, number>;
}

export interface PlayerPassedPayload {
  playerId: string;
}

export interface EndRoundPayload {
  winnerId: string | null;
  scores: Record<string, number>;
}

export interface GameOverPayload {
  winnerId: string | null;
  finalScores: Record<string, number>;
}

export interface GameSyncPayload {
  currentPool: string;
  currentRound: number;
  maxRounds: number;
  activePlayerId: string;
  roundScores: Record<string, number>;
  gameScores: Record<string, number>;
}