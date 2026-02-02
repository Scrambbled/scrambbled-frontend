import type { Game } from "./games/game_stuff"

let _game: Game | undefined
let _accessCode: string | undefined

export const useGameState = () => ({
    getGame: () => _game,
    setGame: (game: Game) => _game = game,
    unsetGame: () => _game = undefined,

    getAccessCode: () => _accessCode,
    setAccessCode: (accessCode: string) => _accessCode = accessCode,
    unsetGameCode: () => _accessCode = undefined,

    clear: () => {
        _game = undefined
        _accessCode = undefined
    }
})