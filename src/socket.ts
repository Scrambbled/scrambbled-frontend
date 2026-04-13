import { io, Socket } from "socket.io-client"
import type { Listener } from "./common_types"

// Common events and their payload types
type CommonEventsAndPayloads = {
    'chat message': {id: string, message: string},
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
        "chat message": [],
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

            socket = io({})
        },

        isConnected: () => socket !== null && socket.connected
    }
}