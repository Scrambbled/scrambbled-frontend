import type { Game } from "./games/game_stuff"

let currentGame: Game | undefined = undefined

export const useGameState = () => ({
    getCurrentGame: () => currentGame,
    setCurrentGame: (game: Game) => currentGame = game,
    unsetCurrentGame: () => currentGame = undefined,
})