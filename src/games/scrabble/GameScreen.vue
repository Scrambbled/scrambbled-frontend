<script setup lang="ts">
import Board from './Board.vue';
import type { BoardData } from './DTOs';
import MovingZoomBox from './MovingZoomBox.vue';

const boardData = {
    height: 15,
    width: 15,
    startingSquare: {x: 7, y: 7},
    specialSquares: [
        {letterMultiplier: 2, wordMultiplier: 0, x: 0, y: 0},
        {letterMultiplier: 3, wordMultiplier: 0, x: 14, y: 0},
        {letterMultiplier: 0, wordMultiplier: 2, x: 0, y: 14},
        {letterMultiplier: 0, wordMultiplier: 3, x: 14, y: 14},
    ]
} as BoardData

</script>

<template>
    <main class="game-screen">
        <MovingZoomBox class="board-manipulation">
            <Board :board-data="boardData"/>
        </MovingZoomBox>
    </main>
</template>

<style lang="scss" scoped>
.game-screen{
    height: 100%;

}

.board-manipulation{
    height: 100%;
}
</style>