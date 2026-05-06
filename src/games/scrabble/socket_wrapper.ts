import type { GameSocket } from "../../api/socket/Socket";
import type { Listener } from "../../common_types";
import type { CheckWordPayload, CheckWordResponse, ScrabbleStartedPayload } from "./DTOs";


export interface ScrabbleListeners{
    onGameStart: Listener<ScrabbleStartedPayload>
}

const mapListenersToEvents = (listeners: ScrabbleListeners) => [
    ['start_game', listeners.onGameStart]
] as [string, Listener<any>][]

export const useScrabbleSocketWrapper = (socket: GameSocket, listeners: ScrabbleListeners) => {

    mapListenersToEvents(listeners)
        .forEach(([name, listener]) => socket.socket?.on(name, listener))

    return {
        checkWord: (word: CheckWordPayload, onAck: Listener<CheckWordResponse>) => socket.sendGameSpecificEvent('check_word', word, onAck),
        startGame: () => socket.sendGameSpecificEvent('start_game', {}),
    }
}