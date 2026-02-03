import type { Socket } from "socket.io-client";
import CalcTogether from "../components/CalcTogether.vue";
import type { Game } from "./game_stuff";

type EventHandlers = {
    onSymbolEntered: (data: any) => any,
    onEnterClicked: (data: any) => any,
    onUserJoined: (data: any) => any,
    onUserLeft: (data: any) => any,
}

export default {
    gameView: CalcTogether,

    // eventHandlers: {
    //     onSymbolEntered: (data: any) => { console.log("Unhandled event: entered-symbol") },
    //     onEnterClicked: (data: any) => { console.log("Unhandled event: enter-clicked") },
    //     onUserJoined: (data: any) => { console.log("Unhandled event: user-joined") },
    //     onUserLeft: (data: any) => { console.log("Unhandled event: user-left") }
    // },

    // registerSocketListeners: (socket: Socket) => {
    //     socket.on('user-joined', )
    //     socket.on('user-left', (args) => console.log(args))
    //     socket.on('entered-symbol', (args) => console.log(args))
    //     socket.on('enter-clicked', (args) => console.log(args))
    // },


} as Game