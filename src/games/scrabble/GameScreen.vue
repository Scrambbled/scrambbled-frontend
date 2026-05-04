<script setup lang="ts">
import Board from './Board.vue';
import type { BoardData } from './DTOs';
import LetterPouch from './LetterPouch.vue';
import LetterTile from './LetterTile.vue';
import LetterTray from './LetterTray.vue';
import MovingZoomBox from './MovingZoomBox.vue';
import { getDefaultScrabbleState } from './scrabble_state';

// TODO: replace with fetch
const boardData = {
    height: 15,
    width: 15,
    startingSquare: {x: 7, y: 7},
    specialSquares: [
        {letterMultiplier: 2, wordMultiplier: 0, x: 0, y: 0},
        {letterMultiplier: 2, wordMultiplier: 0, x: 1, y: 1},
        {letterMultiplier: 3, wordMultiplier: 0, x: 14, y: 0},
        {letterMultiplier: 0, wordMultiplier: 2, x: 0, y: 14},
        {letterMultiplier: 0, wordMultiplier: 3, x: 14, y: 14},
    ]
} as BoardData

const scrabbleState = getDefaultScrabbleState()

// TODO: Replace with fetch
scrabbleState.letterTray.value = [
    {letter: 'a', points: 1}
]

</script>

<template>
    <main class="game-screen">
        <MovingZoomBox class="board-manipulation">
            <Board :board-data="boardData"/>
        </MovingZoomBox>

        <LetterTray class="letter-tray" :scrabble-state="scrabbleState" :max-tiles="8"/>

        <LetterPouch class="letter-pouch" :scrabble-state="scrabbleState"/>
    </main>
</template>

<style lang="scss" scoped>
.game-screen{
    height: 100%;

    position: relative;
}

.board-manipulation{
    height: 100%;
}

.letter-tray{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.letter-pouch{
    position: absolute;
    bottom: 0;
    left: 0;
}
</style>