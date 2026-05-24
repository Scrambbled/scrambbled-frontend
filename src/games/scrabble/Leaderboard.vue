<script setup lang="ts">
import type { ScrabbleState } from './scrabble_state';

const {state, displayLimit} = defineProps<{state: ScrabbleState, displayLimit: number}>();

</script>

<template>
    <ul class="scoreboard">
        <li class="score" v-for="playerWithPoints in state.playersAndPoints.value.sort((p1, p2) => p2.points - p1.points).slice(0, displayLimit)">
            <p class="host-indicator" v-if="playerWithPoints.isHost">HOST</p>
            <img class="icon" :src="playerWithPoints.player.iconUrl" alt="">
            <p class="name">{{ playerWithPoints.player.nickname }}</p>
            <p class="points">{{ playerWithPoints.points }}</p>
        </li>
    </ul>
</template>

<style lang="scss" scoped>

.scoreboard{
    display: grid;
    grid-auto-rows: 4rem;
    grid-template-columns: 1.25rem 3rem auto min-content;
    gap: 1rem .5rem;
}

.score{
    grid-column: 1 / -1;

    display: grid;
    grid-template-columns: subgrid;
    grid-template-areas: 'host icon name points';
    align-items: center;

    background-color: white;

    border-radius: 1rem 0 0 1rem;

    box-shadow: 0 0.25rem 0 #bbb;

    padding-inline-end: 1rem;

    & .host-indicator{
        background-color: #292233;
        color: white;

        writing-mode: vertical-rl;
        text-orientation: upright;

        font-size: .8rem;

        letter-spacing: -.3rem;

        height: 100%;

        text-align: center;

        border-radius: inherit;
    }

    & .icon{
        grid-column: 2;
        height: 2.5rem;
    }
}

</style>