import type { Socket } from "socket.io-client";
import type { Component } from "vue";
import type { FnMap } from "../misc/tools";

export interface Game{
    gameView: Component
    // registerSocketListeners: (socket: Socket) => any
    // eventHandlers: E
}