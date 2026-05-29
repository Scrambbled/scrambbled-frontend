<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import Board from './Board.vue';
import type { BoardData, CheckWordResponse, GameConfigAck, PlacedTile, TurnStartPayload } from './DTOs';
import LetterPouch from './LetterPouch.vue';
import LetterTile from './LetterTile.vue';
import LetterTray from './LetterTray.vue';
import MovingZoomBox from './MovingZoomBox.vue';
import { getDefaultScrabbleState } from './scrabble_state';
import { useGameSocket } from '../../api/socket/Socket';
import { isDebugEnv } from '../../misc/tools';
import { useRouter } from 'vue-router';
import { useScrabbleSocketWrapper } from './socket_wrapper';
import TopBar from './TopBar.vue';
import GameSetupScreen, { type GameSetup } from './GameSetupScreen.vue';
import Leaderboard from './Leaderboard.vue';
import { placedTileToLetterOnlyPlacedTile } from './misc.ts';
import { useGameState } from '../../game_state.ts';

const gameState = useGameState()

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

        scrabbleState.gamePhase.value = 'round'
    },
    onTrayUpdate: data => {
        console.log("New tray: ", data);
        
        scrabbleState.letterTray.value = data.tray
    },
    onHostAssigned: data => {
        console.log('Host changed to: ', data);
    
        scrabbleState.host.value = data
    },
    onPlayerJoin: data => {
        scrabbleState.playersAndPoints.value.push({player: data.player, points: 0})
    },
    onTurnStart: prepareNextRound,
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

// Synchronize with game state
onMounted(() => {
    scrabbleState.host.value = gameState.host.value

    const startRoomState = gameState.getStartRoomState()

    scrabbleState.playersAndPoints.value = 
        startRoomState?.members.map(player => ({player: player.player, points: 0})) ?? []

    console.log('gameState: ', startRoomState)
    console.log('Synced members: ', scrabbleState.playersAndPoints.value)

    console.log(scrabbleState.host.value);
}) 

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

const wordInfoText = ref('')
const wordStatusClass = ref('')
const submitWordButtonInactiveClass = ref('')
const submitWordButtonClasses = ref(new Set(['submit-word', 'hidden']))

// Change submit word button class as player's round changes
watch(scrabbleState.isPlayersRound, (isPlayersRound) => {
    // console.log("Changed");
    
    submitWordButtonInactiveClass.value = (isPlayersRound ? '' : 'inactive')
}, { immediate: true })

// Letters passed to submit and check word
let currentLetters = [] as PlacedTile[]

function onWordPlaced(letters: PlacedTile[]){
    type Status = CheckWordResponse['status']
    const statusLabelMap = new Map<Status, string>([
        ['good', 'Submit: %p points'],
        ['bad', 'Word does not exist'],
        ['invalid_placement', 'Invalid placement'],
        ['must_contain_starting_square', 'Must contain starting square']
    ])

    const statusStatusClassMap = new Map<Status, string>([
        ['good', 'correct'],
        ['bad', 'wrong'],
        ['invalid_placement', 'incorrect-placement'],
        ['must_contain_starting_square', 'incorrect-placement'],
    ])

    // If word is empty hide the submit button
    if(letters.length === 0){
        submitWordButtonClasses.value.add('hidden')
        return
    }

    currentLetters = letters
    
    scrabbleSocket.checkWord({placedTiles: letters.map(placedTileToLetterOnlyPlacedTile)}, d => {
        // Show button
        submitWordButtonClasses.value.delete('hidden')

        // Change caption, replace %p with points. 
        // If status not handled by the label map, 
        // show raw status in single quotes
        const pointsString = d.points?.toString() ?? '?'
        wordInfoText.value = statusLabelMap.get(d.status)?.replace('%p', pointsString) ?? `'${d.status}'`

        // Change error class
        wordStatusClass.value = statusStatusClassMap.get(d.status) ?? 'unhandled'
    })
}


// TODO: Maybe make it async?
function startGame(data: GameSetup){
    const afterGameConfigured = (data: GameConfigAck) => {
        if(data.status === 'ok'){
            console.log('Game configured with: ', data)

            scrabbleState.gamePhase.value = 'round'
            scrabbleSocket.startGame()
        } else {
            console.error('Game could not be configured: ', data)
        }
    }

    const sendConfig = () => {
        scrabbleSocket.configureGame(data.config, afterGameConfigured)
    }

    // If language is custom upload dict and scores
    if(data.config.language === 'custom'){
        // Check for files
        if(!(data.customDict && data.customScores)){
            console.error('Custom language selected, but files were not provided')
            return
        }
        // TODO: when implemented on backend, add error handling
        socket.uploadDictionary(data.customDict, (dictData) => {
            socket.uploadLetterValues(data.customScores as File, (scoresData) => {
                console.log(
                    "Files send with messages:",
                    "\nDict: ", dictData, 
                    '\nScores: ', scoresData
                )
                
                sendConfig()
            })
        })
    } else {
        sendConfig()
    }
}

function submitWord(){
    scrabbleSocket.submitMove(
        {placedTiles: currentLetters.map(placedTileToLetterOnlyPlacedTile)},
        (data) => { scrabbleState.letterTray.value = data.newTray }
    )
}

const boardRef = useTemplateRef('board')

function prepareNextRound(data: TurnStartPayload){
    scrabbleState.isPlayersRound.value = data.activePlayerId === socket.getClientId()

    // TODO: update with backend values
    boardRef.value?.updatePlacedTiles([])

    // Update points
    scrabbleState.playersAndPoints.value.forEach(player => {
        player.points = data.scores[player.player.id] ?? -1
    })

    // Update pouch letter count
    scrabbleState.pouchLetterCount.value = data.lettersInPouch
}


// scrabbleState.playersAndPoints.value = [
//     {points: 20, player: { iconUrl: '/api/static/user_icons/sock_puppet_blue.png', id: '', nickname: "Buffalo" }},
//     {points: 0, player: { iconUrl: '/api/static/user_icons/sock_puppet_green.png', id: '', nickname: "Buffalo" }},
//     {points: 243, player: { iconUrl: '/api/static/user_icons/sock_puppet_blue.png', id: '', nickname: "Buffalo" }},
//     {points: 100, player: { iconUrl: '/api/static/user_icons/sock_puppet_pink.png', id: '', nickname: "Buffalo" }},
//     {points: 15, player: { iconUrl: '/api/static/user_icons/sock_puppet_yellow.png', id: '', nickname: "Buffalo" }},
// ]

// TODO: Pass handling

</script>

<template>
    <main v-if="scrabbleState.gamePhase.value === 'setup'" class="game-setup">
        <GameSetupScreen @start-game-clicked="startGame"/>
    </main>

    <main v-else-if="scrabbleState.gamePhase.value === 'round'" class="game-screen"
        @pointermove="gamePointerMove"
        @pointerup="gamePointerUp"
    >
        <MovingZoomBox class="board-manipulation" :stop-movement="scrabbleState.isLetterFloating.value">
            <Board ref="board" :board-data="boardData" :scrabble-state="scrabbleState" @new-letter-placement="onWordPlaced"/>
        </MovingZoomBox>

        <section class="bottom-bar">
            <button 
                :class="[...submitWordButtonClasses, wordStatusClass, submitWordButtonInactiveClass].join(' ')" 
                :disabled="wordStatusClass !== 'correct' || !scrabbleState.isPlayersRound.value" 
                @click.prevent="submitWord"
            >
                {{ wordInfoText }}
            </button>
            
            <LetterTray class="letter-tray" :scrabble-state="scrabbleState" :max-tiles="8"/>
        </section>

        <LetterPouch @click="scrabbleState.isPlayersRound.value = !scrabbleState.isPlayersRound.value" class="letter-pouch" :scrabble-state="scrabbleState"/>

        <LetterTile :class="floatingLetterClass" :style="floatingLetterVars" :letter-tile="scrabbleState.floatingLetter.value"/>

        <TopBar class="top-bar" :state="scrabbleState"/>

        <Leaderboard class="leaderboard" :state="scrabbleState" :display-limit="5"/>
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
        &.inactive{
            background-color: #777;
            border-color: hsl(0, 0%, 29%);

            cursor: not-allowed;
        }

    }
}

.leaderboard{
    position: absolute;
    right: 0;
    top: 50%;
    // Move in x until only image shows
    transform: translate(calc(100% - (1.25rem + 3rem + .5rem / 2)), -50%);

    transition: transform .2s;
    
    &:hover,
    &:focus-visible{
        transform: translate(0, -50%);
    }
}
</style>