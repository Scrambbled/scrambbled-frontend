import { useRouter } from "vue-router";
import { useGameState } from "./game_state";
import WordInSentence from "./games/word_in_sentence/WordInSentence.vue";

export function handleGame(gameId: string){
    if((supportedGames as readonly string[]).indexOf(gameId) === -1){
        return false
    }

    const gameState = useGameState()
    gameState.setGameId(gameId as SupportedGame)

    return true
}

export const supportedGames = ["Words_in_words_game"] as const
export type SupportedGame = typeof supportedGames[number]

export const viewForGameId: {[key in SupportedGame]: any} = {
    "Words_in_words_game": WordInSentence
}