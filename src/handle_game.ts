import { useGameState } from "./game_state";
import ScrabbleGameScreen from "./games/scrabble/GameScreen.vue";
import WordInSentence from "./games/word_in_sentence/WordInSentence.vue";

export function handleGame(gameId: string){
    if((supportedGames as readonly string[]).indexOf(gameId) === -1){
        return false
    }

    const gameState = useGameState()
    gameState.setGameId(gameId as SupportedGame)

    return true
}

export const supportedGames = ["words_in_words_game", "scrabble_game"] as const
export type SupportedGame = typeof supportedGames[number]

export const viewForGameId: {[key in SupportedGame]: any} = {
    "words_in_words_game": WordInSentence,
    "scrabble_game": ScrabbleGameScreen,
}

export interface GameFrontData{
    icon: string,
    gameId: SupportedGame,
    name: string,
}

const gameIdFrontDataMap: {[key in SupportedGame]: GameFrontData} = {
    'words_in_words_game': { icon: '', gameId: 'words_in_words_game', name: "Words in Words"},
    'scrabble_game': { icon: '', gameId: 'scrabble_game', name: "Scrabble"},
}

export const getFrontGameData = (gameId: string) => gameIdFrontDataMap[gameId as SupportedGame] ?? null