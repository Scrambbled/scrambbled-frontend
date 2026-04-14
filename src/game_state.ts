import type { SupportedGame } from "./handle_game"

let _gameId: SupportedGame | null = null

export const useGameState = () => ({
    setGameId: (gameId: SupportedGame) => _gameId = gameId,
    getGameId: () => _gameId
})