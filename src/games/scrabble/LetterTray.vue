<script setup lang="ts">
import type { LetterTileData } from './data_type';
import LetterTile from './LetterTile.vue';
import type { ScrabbleState } from './scrabble_state';

const {maxTiles, scrabbleState} = defineProps<{maxTiles: number, scrabbleState: ScrabbleState | undefined}>()

const tiles = scrabbleState?.letterTray ?? []

const cssVars = {
    "--max-tiles": maxTiles
}

</script>

<template>
    <ul class="letter-tray" :style="cssVars">
        <li v-for="tile in tiles" class="tile-holder"> 
            <LetterTile :letter-tile="tile"/>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.letter-tray{
    --tile-size: 4rem;
    --max-tiles: 8;

    display: grid;
    grid-template-columns: repeat(var(--max-tiles), var(--tile-size));
    gap: 1rem;

    list-style-type: none;

    border-radius: 1rem 1rem 0rem 0rem;

    padding: 1rem 1rem 0 1rem;
    background-color: hsl(30, 58%, 31%);
    background-image: linear-gradient(
        to bottom,
        transparent 20%,
        #0003 100%
    );

    border: .25rem solid hsl(30, 58%, 41%);
    border-bottom-width: .5rem;

    & .tile-holder{

    }
}
</style>