import { io, Socket } from "socket.io-client"
import type { Listener } from "../../common_types"
import type { AllPlayersPayload, FileUploadData, UserData } from "./DTOs"

// Common events and their payload types
type CommonEventsAndPayloads = {
    'chat-message': string,
    'connect': {},
    'disconnect': {},
    'host-upgrade': {host: UserData},
    'server-message': {},
}
type CommonEvent = keyof CommonEventsAndPayloads
type CommonEventListener<E extends CommonEvent> = Listener<CommonEventsAndPayloads[E]>

let socket: Socket | null = null

/**
 * Gives access to main game socket
 */
export const useGameSocket = () => {
    // Stores handlers register for the current use
    const registeredHandlers: {[key in CommonEvent]: CommonEventListener<key>[]} = {
        "chat-message": [],
        "connect": [],
        "disconnect": [],
        "host-upgrade": [],
        'server-message': [],
    }

    return {
        socket,

        addCommonEventHandler: <E extends CommonEvent>(eventName: E, handler: CommonEventListener<E>) => {
            if(socket === null) return
            
            registeredHandlers[eventName].push(handler)
            socket.on(eventName as string, (...data) => {
                handler(data[0])
            })
        },

        onceCommonEventHandler: <E extends CommonEvent>(eventName: E, handler: CommonEventListener<E>) => {
            if(socket === null) return

            socket.once(eventName as string, (...data) => {
                handler(data[0])
            })
        },

        cleanUp: () => {
            // Remove registered listeners from socket
            for(const event in registeredHandlers){
                registeredHandlers[event as CommonEvent].forEach(handler => {
                    socket?.removeListener(event, handler)
                })
            }
        },

        connect: (accessCode: string, icon: string, name: string) => {
            if(socket !== null){
                socket.close()
            }

            socket = io({query: {accessCode, icon, nickname: name}, transports: ["websocket"]})
        },

        isConnected: () => socket !== null && socket.connected,

        // TODO: Change to ID received from server as Socket.io discourages using socket.id
        getClientId: () => socket?.id,

        sendGameSpecificEvent: (name: string, payload: any, ack_listener: Listener<any> | null = null) => {
            socket?.emit('game-specific-event', {
                eventName: name,
                data: payload,
            }, ack_listener)
        },

        getAllPlayers: (callback: Listener<AllPlayersPayload>) => {
            socket?.emit('all-players', {}, callback)
        },

        uploadDictionary: (file: File, onAck: Listener<any>) => {
            file.arrayBuffer().then(data => {
                socket?.emit(
                    'dictionary-upload', 
                    {
                        filename: file.name,
                        data
                    } as FileUploadData, 
                    onAck
                )
            })
            
        },

        uploadLetterValues: (file: File, onAck: Listener<any>) => {
            file.arrayBuffer().then(data => {
                socket?.emit(
                    'upload-letter-values', 
                    {
                        filename: file.name,
                        data
                    } as FileUploadData, 
                    onAck
                )
            })
             
        },
    }
}

export type GameSocket = ReturnType<typeof useGameSocket>