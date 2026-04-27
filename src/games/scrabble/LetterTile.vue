<script setup lang="ts">
import type { LetterTileData } from './data_type';


const {letterTile} = defineProps<{letterTile: LetterTileData}>()
const {letter, points} = letterTile

const emit = defineEmits<{clicked: [event: PointerEvent]}>()
</script>

<template>
    <button class="letter-tile" @click.prevent="e => emit('clicked', e)">
        <p class="points">{{ points }}</p>
        <p class="letter">{{ letter }}</p>
    </button>
</template>

<style lang="scss" scoped>

.letter-tile{
    --size: 4rem;
    --color: hsl(41, 51%, 61%);

    --_border-radius: calc(var(--size) / 6);
    --_border-width: calc(var(--size) / 12);

    width: var(--size);
    height: var(--size);

    border-radius: var(--_border-radius);

    background-color: var(--color);

    outline: 0;
    border: none;

    position: relative;

    border-bottom: var(--_border-width) solid hsl(0 0% 0% / 0.2);
    border-top: var(--_border-width) solid hsl(0 0% 100% / 0.3);

    & .letter{
        font-size: calc(var(--size) * .75);

        text-transform: uppercase;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    & .points{
        position: absolute;
        top: var(--_border-width);
        right: calc(var(--_border-width) * 2);

        font-size: calc(var(--size) / 4);
    }
}

</style>