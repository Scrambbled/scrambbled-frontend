<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Board from './Board.vue';
import type { BoardData, PlacedTile } from './DTOs';
import LetterPouch from './LetterPouch.vue';
import LetterTile from './LetterTile.vue';
import LetterTray from './LetterTray.vue';
import MovingZoomBox from './MovingZoomBox.vue';
import { getDefaultScrabbleState } from './scrabble_state';
import { useGameSocket } from '../../api/socket/Socket';
import { isDebugEnv } from '../../misc/tools';
import { useRouter } from 'vue-router';
import { useScrabbleSocketWrapper } from './socket_wrapper';
import TopBar, { type WordInfo } from './TopBar.vue';

const router = useRouter()
const socket = useGameSocket()

if(!socket.isConnected && !isDebugEnv()){
    console.warn('Socket not connected');
    router.replace('/')
}

const scrabbleSocket = useScrabbleSocketWrapper(socket, {
    onGameStart: data => {
        console.log("Setting board data");
        boardData.value = data.boardData
    },
    onTrayUpdate: data => {
        scrabbleState.letterTray.value = data.tray
    }
})

// TODO: replace with fetch
const boardData = ref({
    height: 15,
    width: 15,
    startingSquare: {x: 7, y: 7},
    specialSquares: [
        // {letterMultiplier: 2, wordMultiplier: 0, x: 0, y: 0},
        // {letterMultiplier: 2, wordMultiplier: 0, x: 1, y: 1},
        // {letterMultiplier: 3, wordMultiplier: 0, x: 14, y: 0},
        // {letterMultiplier: 0, wordMultiplier: 2, x: 0, y: 14},
        // {letterMultiplier: 0, wordMultiplier: 3, x: 14, y: 14},
    ]
} as BoardData)

const scrabbleState = getDefaultScrabbleState()

// TODO: Replace with fetch
// scrabbleState.letterTray.value = [
//     {letter: 'a', points: 1},
//     {letter: 'z', points: 5}
// ]

let floatingLetterClass = ref("")
watch(scrabbleState.isLetterFloating, (isFloating) => {
    const classes = ['floating-letter']

    if(!isFloating){
        classes.push('hidden')
    }
        
    floatingLetterClass.value = classes.join(' ')
})

let floatingLetterVars = ref({
    '--x': `${scrabbleState.floatingLetterPos.value.x}px`,
    '--y': `${scrabbleState.floatingLetterPos.value.y}px`,
})
watch(scrabbleState.floatingLetterPos, (newPos) => {
    floatingLetterVars.value = {
        '--x': `${newPos.x}px`,
        '--y': `${newPos.y}px`,
    }
})

function gamePointerMove(e: PointerEvent){
    if(scrabbleState.isLetterFloating.value){
        scrabbleState.floatingLetterPos.value = {x: e.clientX, y: e.clientY}

    }
}

function gamePointerUp(e: PointerEvent){
    if(scrabbleState.isLetterFloating.value){
        scrabbleState.isLetterFloating.value = false
    }
}

const wordInfo = ref<WordInfo | null>(null)

function onWordPlaced(letters: PlacedTile[]){
    console.log("Womp");
    
    scrabbleSocket.checkWord({
        placedTiles: letters.map(tile => ({
            x: tile.x,
            y: tile.y,
            letter: tile.tile.letter
        }))
    }, d => {
        if(d.status === 'good'){
            wordInfo.value = {
                error: 'none',
                isCorrect: true,
                points: d.points as number
            }
        }
        else{
            wordInfo.value = {
                // TODO: fix it
                error: d.status as any,
                isCorrect: false,
                points: 0,
            }
        }
    })
}

</script>

<template>
    <main class="game-screen"
        @pointermove="gamePointerMove"
        @pointerup="gamePointerUp"
    >
        <MovingZoomBox class="board-manipulation" :stop-movement="scrabbleState.isLetterFloating.value">
            <Board :board-data="boardData" :scrabble-state="scrabbleState" @new-letter-placement="onWordPlaced"/>
        </MovingZoomBox>

        <LetterTray class="letter-tray" :scrabble-state="scrabbleState" :max-tiles="8"/>

        <LetterPouch @click="scrabbleSocket.startGame()" class="letter-pouch" :scrabble-state="scrabbleState"/>

        <LetterTile :class="floatingLetterClass" :style="floatingLetterVars" :letter-tile="scrabbleState.floatingLetter.value"/>

        <TopBar class="top-bar" :points="1234" :player-count="5" :word-info="wordInfo"/>
    </main>
</template>

<style lang="scss" scoped>
.game-screen{
    height: 100%;

    position: relative;
    overflow: hidden;
}

.board-manipulation{
    height: 100%;
}

.letter-tray{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.letter-pouch{
    position: absolute;
    bottom: 0;
    left: 0;
}

.floating-letter{
    --x: 0;
    --y: 0;

    position: absolute;
    z-index: 100;
    top: var(--y);
    left: var(--x);
    transform: translate(-50%, -50%);

    pointer-events: none;

    &.hidden{
        display: none;
    }
}

.top-bar{
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    width: min(80rem, 90%);
}
</style>