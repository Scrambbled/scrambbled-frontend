import type { EndRoundPayload, GameOverPayload, GameStartedPayload, GameSyncPayload, PlayerPassedPayload, StartGameData, SubmitWordData, TurnStartPayload, WordResultPayload } from "./DTOs";
import type { Listener } from "../../common_types";
import type { GameSocket } from "../../api/socket/Socket";


export interface WordsInSentenceListeners{
    onStartGame: Listener<GameStartedPayload>,
    onTurnStart: Listener<TurnStartPayload>,
    onWordResult: Listener<WordResultPayload>,
    onPlayerPass: Listener<PlayerPassedPayload>,
    onRoundEnd: Listener<EndRoundPayload>,
    onGameOver: Listener<GameOverPayload>,
    onGameSync: Listener<GameSyncPayload>,
}

const mapListenersToEvents = (listeners: WordsInSentenceListeners) => [
    ['game_started', listeners.onStartGame],
    ['turn_start', listeners.onTurnStart],
    ['word_result', listeners.onWordResult],
    ['user_passed', listeners.onPlayerPass],
    ['round_end', listeners.onRoundEnd],
    ['game_over', listeners.onGameOver],
    ['game_sync', listeners.onGameSync],
] as [string, Listener<any>][]

export interface WordsInSentenceActions{
    submitWord: (word: string) => any,
    startGame: (data: StartGameData) => any,
    pass: () => any,
}

export const wordsInSentenceSocketWrapper = (socket: GameSocket, listeners: WordsInSentenceListeners) => {
    mapListenersToEvents(listeners)
        .forEach(([name, listener]) => socket.socket?.on(name, listener))

    return {
        submitWord: word => {
            socket.sendGameSpecificEvent("submit_word", { word } as SubmitWordData)
        },
        startGame: data => {
            socket.sendGameSpecificEvent("submit_word", data)
        },
        pass: () => {
            socket.sendGameSpecificEvent("pass", {})
        }
    } as WordsInSentenceActions
}