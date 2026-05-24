<script setup lang="ts">
import type { ScrabbleState } from './scrabble_state';


export interface WordInfo{
    isCorrect: boolean,
    error: 'incorrect_placement' | 'must_contain_starting_square' | 'unknown_word' | 'none',
    points: number,
}

const {state} = defineProps<{state: ScrabbleState}>()

</script>

<template>
    <header class="top-bar">
        <p class="player-count">Players: {{ state.playersAndPoints.value.length }}</p>
        <h1 class="title">SCRABBLE</h1>
        <p class="points">Points: {{ state.points }}</p>
    </header>
</template>


<style lang="scss" scoped>
.top-bar{
    position: relative;

    display: grid;
    grid-template-columns: min-content auto min-content;
    align-items: center;

    background-color: hsla(34, 53%, 41%);

    border-radius: 0 0 1rem 1rem;

    outline: .25rem solid hsla(34, 53%, 61%);
    padding: .25rem 1rem;

    color: white;
}

.title{
    text-align: center;
    letter-spacing: .25rem;
}

.player-count, .points{
    text-wrap: nowrap;
}

</style>