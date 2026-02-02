import type { Socket } from "socket.io-client";
import type { Component, VueElement } from "vue";

export interface Game{
    gameView: Component
    registerSocketListeners: (socket: Socket) => any
}