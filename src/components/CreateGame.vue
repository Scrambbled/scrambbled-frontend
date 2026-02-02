<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../api/ApiHandler';
import { getFrontGameData, type FrontGameData } from '../games/Games';
import { useGameState } from '../game_state';
import type { Game } from '../games/game_stuff';
import { router } from '../router';

const apiHandler = useApiHandler();
const gameState = useGameState();

const allGames = ref<FrontGameData[]>([])

onMounted(() => {
    apiHandler.getAllGames(games => allGames.value = games.map(game => getFrontGameData(game.gameId)).filter(v => v !== undefined))
})

function createGame(game: FrontGameData){
    apiHandler.createSession(game.gameId, accessCode => {
        gameState.setGame(game.game)
        gameState.setAccessCode(accessCode)
        
        router.push('/game')
    })
}

</script>

<template>
    <div class="create-game-menu">
        <ul>
            <li v-for="game in allGames"><button @click.prevent="createGame(game)"><img :src="game.iconPath" alt=""></button></li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
img{
    width: 3rem;
}
</style>