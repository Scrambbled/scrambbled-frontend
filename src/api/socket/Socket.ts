import { io, Socket } from "socket.io-client"

let socket: Socket

function connectToSocket(accessCode: string){
    if(socket !== undefined)
        return 

    socket = io(`/?accessCode=${accessCode}`, {
        
    })

    socket.on("connect", () => {
        console.log("Connected to a game session");
    })

    socket.on("disconnect", () => {
        console.log("Disconnected from a game session");
    })
}

export const useSocket = () => ({
    connect: (accessCode: string) => connectToSocket(accessCode),
    getSocket: () => socket,
})