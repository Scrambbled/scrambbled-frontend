<script setup lang="ts">
import { ref, type Ref, toRef, computed, watch } from 'vue';
import { xyIterator } from '../../tools';
import type { LetterTileData } from './data_type';
import type { BoardData, CheckWordPayload, PlacedTile, SpecialSquare } from './DTOs';
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

watch(currentRoundTiles, newTiles => {
    emit('newLetterPlacement', newTiles)
})

// Reset placedTiles when board size changes
watch(() => boardData.value.height, (h) => {
    placedTiles.value = new Array(h)
})

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

    const samePosTileIndex = currentRoundTiles.value.findIndex(value => value.x === pos.x && value.y === pos.y)
    const placedTile = {letter: scrabbleState.floatingLetter.value.letter, x: pos.x, y: pos.y}
    
    if(samePosTileIndex === -1){
        currentRoundTiles.value.push(placedTile)
    } else {
        currentRoundTiles.value[samePosTileIndex] = placedTile
    }
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