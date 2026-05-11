<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import type { LetterTileData } from './data_type';
import LetterTile from './LetterTile.vue';
import type { ScrabbleState } from './scrabble_state';

const {maxTiles, scrabbleState} = defineProps<{maxTiles: number, scrabbleState: ScrabbleState | undefined}>()

const trayContents = ref<(null | LetterTileData)[]>(new Array(maxTiles).fill(null))

if(scrabbleState !== undefined){
    // When tray changes (e.g. initial change)
    // If letters in tray contents are different from the new ones
    // update tray contents
    watch(scrabbleState.letterTray, newTray => {
        console.log('update', newTray);
        
        const lettersFromTray = trayContents.value.filter(letter => letter !== null).map(letter => letter.letter).sort()
        const newLetters = newTray.map(letter => letter.letter).sort()

        let matches = lettersFromTray.length === newLetters.length;

        if(matches){
            for(let i = 0; i < lettersFromTray.length; i++){
                if(lettersFromTray[i] !== newLetters[i]){
                    matches = false
                    break
                }
            }
        }

        if(!matches){
            newTray.forEach((letter, i) => {
                trayContents.value[i] = letter
            })
        }
    })
}

const cssVars = {
    "--max-tiles": maxTiles
}

let lastPickedIndex: number = 0;

function startTileDrag(e: PointerEvent, letter: LetterTileData, index: number){
    if(scrabbleState === undefined){
        return
    }

    scrabbleState.floatingLetterPos.value = {x: e.clientX, y: e.clientY}
    scrabbleState.isLetterFloating.value = true
    scrabbleState.floatingLetter.value = letter
    scrabbleState.floatingLetterSource.value = 'tray'

    scrabbleState.onFloatingLetterCancel = () => {
        trayContents.value[index] = scrabbleState.floatingLetter.value
        scrabbleState.isLetterFloating.value = false
    }

    lastPickedIndex = index
    trayContents.value[index] = null
}

function dropOnLetterPlace(e: PointerEvent, index: number){
    console.log("Eh?");
    
    if(!scrabbleState?.isLetterFloating.value){
        return
    }
    
    if(index >= maxTiles){
        console.warn("Tried to drop a tile outside of the tray space")
        return
    }

    if(trayContents.value[index] === null){
        trayContents.value[index] = scrabbleState.floatingLetter.value
    } 
    else{
        if(scrabbleState.floatingLetterSource.value !== 'tray'){
            scrabbleState.onFloatingLetterCancel()
            scrabbleState.isLetterFloating.value = false
            return
        }

        // Move whats under the cursor to spot from where letter was last picked
        trayContents.value[lastPickedIndex] = trayContents.value[index] as LetterTileData
        trayContents.value[index] = scrabbleState.floatingLetter.value
    }

    scrabbleState.isLetterFloating.value = false
}

const trayElemRef = useTemplateRef('tray')

function dropOnTray(e: PointerEvent){
    if(
        !scrabbleState?.isLetterFloating
        || e.target !== trayElemRef.value
    ){
        return
    }

    scrabbleState.onFloatingLetterCancel()
    scrabbleState.isLetterFloating.value = false
}

</script>

<template>
    <ul ref="tray" class="letter-tray" :style="cssVars" @pointerup="dropOnTray">
        <li v-for="tile, i in trayContents" class="tile-holder" @pointerup.prevent="e => dropOnLetterPlace(e, i)"> 
            <LetterTile 
                v-if="tile !== null"
                :letter-tile="tile"
                @drag-start="e => startTileDrag(e, tile, i)"
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.letter-tray{
    --tile-size: 4rem;
    --tile-gap: 1rem;
    --max-tiles: 8;

    display: grid;
    grid-template-columns: repeat(var(--max-tiles), calc(var(--tile-size) + var(--tile-gap)));

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
}

.tile-holder{
    width: var(--tile-size);
    height: var(--tile-size);
    box-sizing: content-box;

    padding-inline: calc(var(--tile-gap) / 2);

    display: grid;
    justify-items: center;
}
</style>