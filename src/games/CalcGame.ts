import CalcTogether from "../components/CalcTogether.vue";
import type { Game } from "./game_stuff";

export default {
    gameView: CalcTogether,

    registerSocketListeners: (socket) => {
        socket.on('user-joined', (args) => console.log(args))
        socket.on('user-left', (args) => console.log(args))
        socket.on('entered-symbol', (args) => console.log(args))
        socket.on('enter-clicked', (args) => console.log(args))
    }
} as Game