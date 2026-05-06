<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useGameState } from '../game_state';
import { handleGame, viewForGameId, type SupportedGame } from '../handle_game';
import { useGameSocket } from '../api/socket/Socket';
import { onUpdated, ref } from 'vue';

const router = useRouter()
const accessCode = useRoute().query.accessCode as string | undefined

const gameState = useGameState()

const socketConnected = ref(false)
const gameId = ref<string | null>(null)

if(accessCode === undefined){
    router.replace("/")
}
else {
    // Remove access code from URL
    router.replace({query: {}})

    const userProfile = gameState.getUserProfileData()

    // Access socket
    const socket = useGameSocket()
    socket.connect(accessCode, userProfile.iconName, userProfile.username)

    socket.addCommonEventHandler('connect', () => {
        console.log('Connected to game socket')

        socketConnected.value = true

        const clientId = socket.getClientId()
        if(clientId){
            gameState.setUserId(clientId)
        }else {
            console.error('No clientId on socket');
        }

        // Hardcode the gameId
        // TODO: Change to event listener
        gameId.value = 'scrabble_game'
        gameState.setAccessCode(accessCode)

        if(!handleGame(gameId.value)){
            console.error(`No game with id '${gameId.value}' found`)
            gameId.value = null
        } else {
            // console.log(socket.socket);
            
        }
    })

    socket.addCommonEventHandler('disconnect', () => {
        console.log('Socket disconnected')

        socketConnected.value = false
    })

    socket.addCommonEventHandler('host-upgrade', data => {
        gameState.host.value = data.host

        console.log("Host update");
        
    })

    // TODO: Add game_id event listener
    // Here should be something like: socket.addCommonEvent('game_id', (id) => gameId.value = id)
    // For now hardcode value to words_in_words_game on socket connect
}

</script>

<template>
    <component v-if="gameId !== null" :is="viewForGameId[gameId as SupportedGame]"></component>
</template>