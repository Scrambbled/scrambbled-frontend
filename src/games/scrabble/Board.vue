<script setup lang="ts">
const side_length = 15;

const style = {"--side-length": side_length}

</script>

<template>
    <section class="board" :style="style">
        <div class="tile-space" v-for="_ in side_length*side_length"></div>
    </section>
</template>

<style lang="scss" scoped>
.board{
    --tile-size: 4rem;

    display: grid;
    grid-template-columns: repeat(var(--side-length), var(--tile-size));
    grid-template-rows: repeat(var(--side-length), var(--tile-size));

    // Temporary grid
    background-image: 
        linear-gradient(to bottom, transparent 49%, black 49%, black 51%, transparent 51%),
        linear-gradient(to left, transparent 49%, black 49%, black 51%, transparent 51%);

    background-size: var(--tile-size) var(--tile-size);
    background-position: calc(var(--tile-size) / 2) calc(var(--tile-size) / 2);
}
</style>