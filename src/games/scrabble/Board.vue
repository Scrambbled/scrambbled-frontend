<script setup lang="ts">
import { ref, type Ref, toRef, computed, watch, useTemplateRef } from 'vue';
import { xyIterator } from '../../tools';
import type { LetterTileData } from './data_type';
import type { BoardData, PlacedTile, SpecialSquare } from './DTOs';
import type { ScrabbleState } from './scrabble_state';
import LetterTile from './LetterTile.vue';

const emit = defineEmits<{
    newLetterPlacement: [letters: PlacedTile[]]
}>();

const props = defineProps<{boardData: BoardData, scrabbleState: ScrabbleState}>()

const boardData = toRef(props, 'boardData')

const scrabbleState = props.scrabbleState

// Recompute lookup when boardData changes
const specialSquareLookup = computed(() =>
    (boardData.value.specialSquares || [])
        .map(square => ([`x${square.x}y${square.y}`, square] as [string, SpecialSquare]))
        .reduce(
            (map, square_entry) => map.set(square_entry[0], square_entry[1]),
            new Map<string, SpecialSquare>()
        )
)

const getSpecialSquare = (x: number, y: number) => specialSquareLookup.value.get(`x${x}y${y}`)

function* enumerateSquares(){
    for(const [x, y] of xyIterator(boardData.value.width, boardData.value.height)){
        const special = getSpecialSquare(x, y)

        let classes = ['square']

        if(special !== undefined){
            if(special.letterMultiplier > 1){
                classes.push(`letter-x${special?.letterMultiplier}`)
            }
            else if(special.wordMultiplier > 1){
                classes.push(`word-x${special?.wordMultiplier}`)
            }
        }

        if(x === boardData.value.startingSquare.x && y === boardData.value.startingSquare.y){
            classes.push('starting-square')
        }

        if(getPlacedTile({x, y}) !== undefined){
            classes.push('occupied')
        }

        yield {class: classes.join(' '), pos: {x, y}}
    }
}

const style = computed(() => ({"--width": boardData.value.width, "--height": boardData.value.height}))

const placedTiles: Ref<Array<Array<LetterTileData>>> = ref(new Array(boardData.value.height))

const currentRoundTiles = ref<PlacedTile[]>([])

// watch(currentRoundTiles, newTiles => {
//     emit('newLetterPlacement', newTiles)
// })

// Reset placedTiles when board size changes
watch(() => boardData.value.height, (h) => {
    placedTiles.value = new Array(h)
})

const getPlacedTile = (pos: {x: number, y: number}) => {
    let tile = placedTiles.value[pos.y] ? (placedTiles.value[pos.y] as LetterTileData[])[pos.x] : undefined
    return tile ?? currentRoundTiles.value.filter(tile => tile.x === pos.x && tile.y === pos.y)[0]?.tile;
}

function onPointerUp(_e: PointerEvent, pos: {x: number, y: number}){
    if(!scrabbleState.isLetterFloating.value){
        return
    }


    let row = placedTiles.value[pos.y];
    // If position occupied in placedTiles or currentRoundTiles
    if((row && row[pos.x] !== undefined) || currentRoundTiles.value.findIndex(tile => tile.x === pos.x && tile.y === pos.y) != -1){
        scrabbleState.onFloatingLetterCancel()
        scrabbleState.isLetterFloating.value = false
        return
    }

    // row[pos.x] = scrabbleState.floatingLetter.value;

    currentRoundTiles.value.push({tile: scrabbleState.floatingLetter.value, x: pos.x, y: pos.y})
    scrabbleState.isLetterFloating.value = false;

    const samePosTileIndex = currentRoundTiles.value.findIndex(value => value.x === pos.x && value.y === pos.y)
    const placedTile = {tile: scrabbleState.floatingLetter.value, x: pos.x, y: pos.y}
    
    if(samePosTileIndex === -1){
        currentRoundTiles.value.push(placedTile)
    } else {
        currentRoundTiles.value[samePosTileIndex] = placedTile
    }

    emit('newLetterPlacement', currentRoundTiles.value)
}

let lastBoardPos = {x: 0, y: 0}

function moveTileOnBoard(e: PointerEvent, pos: {x: number, y: number}){
    if(scrabbleState.isLetterFloating.value)
        return

    const letterIndex = currentRoundTiles.value.findIndex(tile => tile.x === pos.x && tile.y === pos.y)

    if(letterIndex === -1)
        return

    const letter = currentRoundTiles.value[letterIndex] as PlacedTile
    
    lastBoardPos = pos

    scrabbleState.floatingLetter.value = letter.tile
    scrabbleState.floatingLetterSource.value = 'board'
    scrabbleState.isLetterFloating.value = true

    scrabbleState.onFloatingLetterCancel = () => {
        scrabbleState.isLetterFloating.value = false
        currentRoundTiles.value.push(letter)

        let row = placedTiles.value[pos.y];
    
        if(row === undefined){
            placedTiles.value[pos.y] = []
            row = placedTiles.value[pos.y] as LetterTileData[]
        }

        row[pos.x] = letter.tile
    }

    currentRoundTiles.value.splice(letterIndex, 1)
    
    const row = placedTiles.value[pos.y]
    if(row !== undefined){
        delete row[pos.x]
    }

    emit('newLetterPlacement', currentRoundTiles.value)
}

const boardElemRef = useTemplateRef('board')

function pointerUpOnBoard(e: PointerEvent){
    if(e.target !== boardElemRef.value)
        return

    if(scrabbleState.isLetterFloating.value){
        scrabbleState.onFloatingLetterCancel()
        scrabbleState.isLetterFloating.value = false
    }
}

</script>

<template>
    <section class="board" :style="style" ref="board" @pointerup="pointerUpOnBoard">
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
                @drag-start="e => moveTileOnBoard(e, square.pos)"
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

    background-color: #ecd0a3;

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