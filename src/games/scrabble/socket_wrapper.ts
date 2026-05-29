import type { GameSocket } from "../../api/socket/Socket";
import type { Listener } from "../../common_types";
import type { CheckWordPayload, CheckWordResponse, ConfigureGamePayload, GameConfigAck, MoveAckResponse, PlayerInfoDTO, PlayerJoinedPayload, ScrabbleStartedPayload, TrayUpdateDTO, TurnStartPayload } from "./DTOs";


export interface ScrabbleListeners{
    onGameStart?: Listener<ScrabbleStartedPayload>,
    onTrayUpdate?: Listener<TrayUpdateDTO>,
    onHostAssigned?: Listener<PlayerInfoDTO>,
    onTurnStart?: Listener<TurnStartPayload>,
    onPlayerJoin?: Listener<PlayerJoinedPayload>,
}

const mapListenersToEvents = (listeners: ScrabbleListeners) => [
    ['start_game', listeners.onGameStart],
    ['tray_update', listeners.onTrayUpdate],
    ['host_assigned', listeners.onHostAssigned],
    ['turn_start', listeners.onTurnStart],
    ['player_joined', listeners.onPlayerJoin],
] as [string, Listener<any>][]

export const useScrabbleSocketWrapper = (socket: GameSocket, listeners: ScrabbleListeners) => {

    mapListenersToEvents(listeners)
        .forEach(([name, listener]) => socket.socket?.on(name, listener))

    return {
        checkWord: (word: CheckWordPayload, onAck: Listener<CheckWordResponse>) => socket.sendGameSpecificEvent('check_word', word, onAck),
        startGame: () => socket.sendGameSpecificEvent('start_game', {}),
        submitMove: (word: CheckWordPayload, onAck: Listener<MoveAckResponse>) => socket.sendGameSpecificEvent('submit_move', word, onAck),
        configureGame: (config: ConfigureGamePayload, onAck: Listener<GameConfigAck>) => socket.sendGameSpecificEvent('configure_game', config, onAck),
    }
}

export type ScrabbleSocket = ReturnType<typeof useScrabbleSocketWrapper>