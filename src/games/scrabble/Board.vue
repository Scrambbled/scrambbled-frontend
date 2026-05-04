<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { xyIterator } from '../../tools';
import type { LetterTileData } from './data_type';
import type { BoardData, SpecialSquare } from './DTOs';
import type { ScrabbleState } from './scrabble_state';
import LetterTile from './LetterTile.vue';


const {boardData, scrabbleState} = defineProps<{boardData: BoardData, scrabbleState: ScrabbleState}>()

const specialSquareLookup = boardData.specialSquares
    .map(square => ([`x${square.x}y${square.y}`, square] as [string, SpecialSquare]))
    .reduce(
        (map, square_entry) => map.set(square_entry[0], square_entry[1]),
        new Map<string, SpecialSquare>()
    )

const getSpecialSquare = (x: number, y: number) => specialSquareLookup.get(`x${x}y${y}`)

function* enumerateSquares(){
    for(const [x, y] of xyIterator(boardData.width, boardData.height)){
        const special = getSpecialSquare(x, y)

        let classes = ['square']

        if(special !== undefined){
            if(special.letterMultiplier > 0){
                classes.push(`letter-x${special?.letterMultiplier}`)
            }
            else if(special.wordMultiplier > 0){
                classes.push(`word-x${special?.wordMultiplier}`)
            }
        }

        if(x === boardData.startingSquare.x && y === boardData.startingSquare.y){
            classes.push('starting-square')
        }

        if(getPlacedTile({x, y}) !== undefined){
            classes.push('occupied')
        }

        yield {class: classes.join(' '), pos: {x, y}}
    }
}

const style = {"--width": boardData.width, "--height": boardData.height}

const placedTiles: Ref<Array<Array<LetterTileData>>> = ref(new Array(boardData.height))

const getPlacedTile = (pos: {x: number, y: number}) => placedTiles.value[pos.y] 
    ? (placedTiles.value[pos.y] as LetterTileData[])[pos.x]
    : undefined

function onPointerUp(_e: PointerEvent, pos: {x: number, y: number}){
    if(!scrabbleState.isLetterFloating.value){
        return
    }

    let row = placedTiles.value[pos.y];
    if(row === undefined){
        placedTiles.value[pos.y] = []
        row = placedTiles.value[pos.y] as LetterTileData[]
    }

    row[pos.x] = scrabbleState.floatingLetter.value;
    scrabbleState.isLetterFloating.value = false;
}

</script>

<template>
    <section class="board" :style="style">
        <div 
            @pointerenter=""
            @pointerleave=""
            @pointerup="e => onPointerUp(e, square.pos)"
            v-for="square in enumerateSquares()"
            :class="square.class"
        >
            <LetterTile 
                v-if="getPlacedTile(square.pos) !== undefined" 
                :letter-tile='getPlacedTile(square.pos) as LetterTileData'
            />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.board{
    --tile-size: 4rem;
    --gap: .5rem;
    --width: 1;
    --height: 1;

    display: grid;
    grid-template-columns: repeat(var(--width), var(--tile-size));
    grid-template-rows: repeat(var(--height), var(--tile-size));
    gap: var(--gap);

    // Temporary grid   
    // --_background-tile-size: calc(var(--tile-size) + var(--gap));

    // background-image: 
    //     linear-gradient(to bottom, transparent 49%, black 49%, black 51%, transparent 51%),
    //     linear-gradient(to left, transparent 49%, black 49%, black 51%, transparent 51%);

    // background-size: var(--_background-tile-size) var(--_background-tile-size);
    // background-position: calc(var(--_background-tile-size) / 2) calc(var(--_background-tile-size) / 2);
}

.square{
    --label: '';

    background-color: #d7ba8b;

    border-radius: 10%;

    position: relative;

    display: grid;
    place-content: center;

    & > *{
        grid-row: 1;
        grid-column: 1;
    }

    &::before{
        content: var(--label);
        color: #fff9;

        font-size: calc(var(--tile-size) * .5);
    }

    &.starting-square{
        --label: '⭐'
    }

    &.word-x2{
        --label: '2W';
        background-color: #6ace7b;
    }

    &.word-x3{
        --label: '3W';
        background-color: #ce7c6a;
    }

    &.letter-x2{
        --label: '2L';
        background-color: #6ac7ce;
    }

    &.letter-x3{
        --label: '3L';
        background-color: #6a77ce;
    }

    &.occupied{
        --label: '';
    }
}
</style>