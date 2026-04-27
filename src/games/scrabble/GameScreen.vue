<script setup lang="ts">
import Board from './Board.vue';
import MovingZoomBox from './MovingZoomBox.vue';

</script>

<template>
    <main class="game-screen">
        <MovingZoomBox class="board-manipulation">
            <Board/>
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