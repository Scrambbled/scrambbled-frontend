<script setup lang="ts">
import type { ScrabbleState } from './scrabble_state';

const {scrabbleState} = defineProps<{scrabbleState: ScrabbleState | undefined}>()

</script>

<template>
    <div class="letter-pouch">
        <p class="letters-left">{{ scrabbleState?.letterPouch.value.length ?? 0 }}</p>
    </div>
</template>

<style lang="scss" scoped>
.letter-pouch{
    position: relative;

    width: 10rem;
    height: 10rem;

    &::before{
        content: '';

        position: absolute;
        inset: 0;

        background-color: #c49263;
        background-image: url('/img/letter-pouch.svg');
        background-blend-mode: color-burn;
        background-size: contain;

        mask-image: url('/img/letter-pouch.svg');
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
}
</style>