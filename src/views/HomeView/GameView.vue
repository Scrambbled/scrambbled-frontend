<script setup lang="ts">
import type { Socket } from 'socket.io-client';
import { useSocket } from '../../api/socket/Socket';
import { useGameState } from '../../game_state';
import type { Game } from '../../games/game_stuff';
import { router } from '../../router';

const gameState = useGameState()
let game = gameState.getGame()
const accessCode = gameState.getAccessCode()

if(game === undefined || accessCode === undefined){
    gameState.clear()
    router.push('/')
}

game = game as Game

const socket = useSocket()

socket.connect(accessCode as string)
// game.registerSocketListeners(socket.getSocket())

</script>

<template>

    <main class="game">
        <component :is="game.gameView"></component>
    </main>

</template>

<style lang="sass" scoped></style>