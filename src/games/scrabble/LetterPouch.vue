<script setup lang="ts">
import type { ScrabbleState } from './scrabble_state';

const {scrabbleState} = defineProps<{scrabbleState: ScrabbleState | undefined}>()

const emit = defineEmits<{
    click: []
}>()

</script>

<template>
    <button @click.prevent="emit('click')" class="letter-pouch">
        <p class="letters-left">{{ scrabbleState?.pouchLetterCount.value ?? 0 }}</p>
    </button>
</template>

<style lang="scss" scoped>
.letter-pouch{
    --_pouch-image: url('/img/letter-pouch.svg');

    position: relative;

    width: 10rem;
    height: 10rem;

    outline: none;
    border: none;
    background-color: transparent;

    &::before{
        content: '';

        position: absolute;
        inset: 0;

        background-color: #c49263;
        background-image: var(--_pouch-image);
        background-blend-mode: color-burn;
        background-size: contain;

        mask-image: var(--_pouch-image);
        mask-size: contain;
    }

    & .letters-left{
        position: absolute;
        bottom: 0;
        right: 0;

        width: 3rem;
        height: 3rem;

        border-radius: 100%;

        color: white;
        font-weight: bold;

        background-color: hsl(23, 57%, 47%);

        display: grid;
        place-content: center;
    }

    &:hover,
    &:focus-visible{
        --_pouch-image: url("/img/letter-pouch-open.svg");

        cursor: pointer;
    }
}
</style>