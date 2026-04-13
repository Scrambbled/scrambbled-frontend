import { io, Socket } from "socket.io-client";
import type { EndRoundPayload, GameOverPayload, GameStartPayload, PlayerPassedPayload, StartGameData, SubmitWordData, TurnStartPayload, WordResultPayload } from "./DTOs";

type Listener<Data> = (data: Data) => any

export interface WordsInSentenceListeners{
    onStartGame: Listener<GameStartPayload>,
    onTurnStart: Listener<TurnStartPayload>,
    onWordResult: Listener<WordResultPayload>,
    onPlayerPass: Listener<PlayerPassedPayload>,
    onRoundEnd: Listener<EndRoundPayload>,
    onGameOver: Listener<GameOverPayload>,
}

const mapListenersToEvents = (listeners: WordsInSentenceListeners) => [
    ['game_started', listeners.onStartGame],
    ['turn_start', listeners.onTurnStart],
    ['word_result', listeners.onWordResult],
    ['user_passed', listeners.onPlayerPass],
    ['round_end', listeners.onRoundEnd],
    ['game_over', listeners.onGameOver],
] as [string, Listener<any>][]

export interface WordsInSentenceActions{
    submitWord: (word: string) => any,
    startGame: (data: StartGameData) => any,
    pass: () => any,
}

export const useWordsInSentenceSocket = (socket: Socket, listeners: WordsInSentenceListeners) => {
    mapListenersToEvents(listeners)
        .forEach(([name, listener]) => socket.on(name, listener))

    return {
        submitWord: word => {
            socket.emit('submit_word', {
                word
            } as SubmitWordData)
        },
        startGame: data => {
            socket.emit('start_game', data)
        },
        pass: () => {
            socket.emit("pass", {})
        }
    } as WordsInSentenceActions
}