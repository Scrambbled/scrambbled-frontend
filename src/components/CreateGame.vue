<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../api/ApiHandler';
import { getFrontGameData, type FrontGameData } from '../games/Games';

const apiHandler = useApiHandler();

const allGames = ref<FrontGameData[]>([])

onMounted(() => {
    apiHandler.getAllGames(games => allGames.value = games.map(game => getFrontGameData(game.gameId)).filter(v => v !== undefined))
})



</script>

<template>
    <div class="create-game-menu">
        <ul>
            <li v-for="game in allGames"><button><img :src="game.iconPath" alt=""></button></li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
img{
    width: 3rem;
}
</style>