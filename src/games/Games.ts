import CalcGame from "./CalcGame"
import type { Game } from "./game_stuff"

export interface FrontGameData{
    iconPath: string,
    game: Game,
    gameId: string,
}

const games = new Map([
    ["calc_game", {
        iconPath: '/img/game_icons/calculator_together.svg',
        game: CalcGame,
        gameId: 'calc_game',
    }],
])

export const getFrontGameData = (gameId: string) => games.get(gameId)