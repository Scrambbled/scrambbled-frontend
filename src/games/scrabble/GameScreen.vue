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
import GameSetupScreen from './GameSetupScreen.vue';

// === Game Phases ===
const gamePhases = ['setup', 'active_round', 'passive_round', 'scores'] as const
type GamePhase = typeof gamePhases[number]

const gamePhase = ref<GamePhase>('setup')


const router = useRouter()

// === Socket ===
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
const wordInfoText = ref('')
const submitWordButtonClasses = ref(new Set(['submit-word', 'hidden']))

function onWordPlaced(letters: PlacedTile[]){
    console.log(letters);

    if(letters.length === 0){
        submitWordButtonClasses.value.add('hidden')
        return
    }
    
    scrabbleSocket.checkWord({
        placedTiles: letters.map(tile => ({
            x: tile.x,
            y: tile.y,
            letter: tile.tile.letter
        }))
    }, d => {
        submitWordButtonClasses.value.delete('hidden')

        if(d.status === 'good'){
            wordInfo.value = {
                error: 'none',
                isCorrect: true,
                points: d.points as number
            }

            submitWordButtonClasses.value.add('correct')

            submitWordButtonClasses.value.delete('wrong')
            submitWordButtonClasses.value.delete('incorrect-placement')

            wordInfoText.value = `Submit: ${d.points} points`
        }
        else{
            wordInfo.value = {
                // TODO: fix it
                error: d.status as any,
                isCorrect: false,
                points: 0,
            }

            submitWordButtonClasses.value.delete('correct')

            if(wordInfo.value.error as string === 'bad'){
                submitWordButtonClasses.value.add('wrong')

                submitWordButtonClasses.value.delete('incorrect-placement')

                wordInfoText.value = 'Word does not exist'
            }
            else{
                submitWordButtonClasses.value.add('incorrect-placement')

                submitWordButtonClasses.value.delete('wrong')

                if(wordInfo.value.error === 'must_contain_starting_square')
                    wordInfoText.value = 'Must contain starting square'
                else
                    wordInfoText.value = 'Incorrect placement'
            }
        }
    })
}

function startGame(data: any){
    console.log("Start game with data: ", data);

    gamePhase.value = 'active_round'

    scrabbleSocket.startGame()
}

function submitWord(){
    
}

</script>

<template>
    <main v-if="gamePhase === 'setup'" class="game-setup">
        <GameSetupScreen @start-game-clicked="startGame"/>
    </main>

    <main v-else-if="gamePhase === 'active_round' || gamePhase === 'passive_round'" class="game-screen"
        @pointermove="gamePointerMove"
        @pointerup="gamePointerUp"
    >
        <MovingZoomBox class="board-manipulation" :stop-movement="scrabbleState.isLetterFloating.value">
            <Board :board-data="boardData" :scrabble-state="scrabbleState" @new-letter-placement="onWordPlaced"/>
        </MovingZoomBox>

        <section class="bottom-bar">
            <button :class="[...submitWordButtonClasses].join(' ')" :disabled="!wordInfo?.isCorrect">{{ wordInfoText }}</button>
            <LetterTray class="letter-tray" :scrabble-state="scrabbleState" :max-tiles="8"/>
        </section>

        <LetterPouch @click="" class="letter-pouch" :scrabble-state="scrabbleState"/>

        <LetterTile :class="floatingLetterClass" :style="floatingLetterVars" :letter-tile="scrabbleState.floatingLetter.value"/>

        <TopBar class="top-bar" :points="1234" :player-count="5" :word-info="wordInfo"/>
    </main>
</template>

<style lang="scss" scoped>

.game-setup{
    height: 100%;

    display: grid;
    place-content: center;
}

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

.bottom-bar{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    // isolation: isolate;

    & .letter-tray{
        position: relative;
    }

    & .submit-word{
        position: absolute;

        left: 50%;
        bottom: 100%;
        transform: translate(-50%, 0);

        padding: .5rem 1rem;

        width: 70%;

        color: white;

        border-radius: 1rem 1rem 0 0;

        border: .25rem solid white;
        border-bottom: 0;

        transition: border-color .2s, background-color .2s, transform .2s;

        cursor: not-allowed;

        &.correct{
            background-color: #2b963d;
            border-color: hsl(130, 55%, 32%);
            cursor: pointer;
        }
        &.wrong{
            background-color: #a53636;
            border-color: hsl(0, 51%, 33%);
        }
        &.incorrect-placement{
            background-color: #329ca3;
            border-color: hsl(184, 53%, 32%);
        }
        &.hidden{
            transform: translate(-50%, 100%);
        }

    }
}
</style>