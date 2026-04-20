 <script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useGameSocket } from '../../api/socket/Socket'
import { wordsInSentenceSocketWrapper } from './socket_wrapper'
import type { TurnStartPayload } from './DTOs'
import GameScreen from './GameScreen.vue'
import WaitingForStartScreen from './WaitingForStartScreen.vue'
import InfoBar from './InfoBar.vue'
import RoundEndScreen from './RoundEndScreen.vue'
import GameOverScreen from './GameOverScreen.vue'

const gamePhases = ['game_over', 'active_turn', 'other_player_turn', 'round_end', 'waiting_for_game'] as const
type GamePhases = typeof gamePhases[number]
let currentGamePhase = ref<GamePhases>('other_player_turn')
let gamePhaseData: any = null

const gameTracker = {
    totalRounds: ref(0),
    currentRound: ref(0),

    // Points gained for turns in current round
    turnPoints: ref(0),
    // Points gained in all rounds
    roundPoints: ref(0),

    usedWords: ref<string[]>(["test", "sentence"]),

    sentence: ref<string | null>(null),
    words: ref<Array<string> | null>(null),
    lettersLeft: new Map<string, number>(),

    // Expect WordResult event
    expectWordCheck: false,
    wasWordCorrect: ref<boolean | null>(null),
}

export type GameTracker = typeof gameTracker

function calcLettersLeft(){
    if(gameTracker.words.value === null)
        return;

    gameTracker.lettersLeft = gameTracker.words.value
        // Into letters
        .flatMap(word => word.split(''))
        // Count 'em up'
        .reduce(
            (acc: Map<string, number>, letter) => {
                // If letter exists - increment, else create entry with value 1
                if(acc.has(letter))
                    acc.set(letter, acc.get(letter) as number + 1)
                else
                    acc.set(letter, 1)

                return acc
            }, 
            new Map<string, number>()
        )
}

const isActiveUser = ref(false)

watch(currentGamePhase, (new_phase, old_phase) => {
    if(gamePhaseData === null){
        console.error(`Game moved from phase '${old_phase}' to phase '${new_phase}', but no phase data was supplied`)
    }

    console.log('Phase changed: ', old_phase, ' -> ', new_phase);
    

    if(new_phase === "active_turn" || new_phase === "other_player_turn"){
        gameTracker.sentence.value = (gamePhaseData as TurnStartPayload).currentPool
        gameTracker.words.value = gameTracker.sentence.value.split(' ')
        calcLettersLeft()
    }

    if(new_phase === "active_turn"){
        isActiveUser.value = true
    }
})

// Main game socket
const socket = useGameSocket()
const socketConnected = ref(socket.isConnected())

socket.addCommonEventHandler('connect', () => {
    socketConnected.value = true
})

socket.addCommonEventHandler('disconnect', () => {
    socketConnected.value = false
})

// Game socket with listeners for this specific game
const wrappedGameSocket = socket.socket !== null ? wordsInSentenceSocketWrapper(socket, {
    onGameOver: (data) => { 
        console.log("Game over: ", data)
        gamePhaseData = data
        currentGamePhase.value = 'game_over'
     },
    onPlayerPass: (data) => { 
        console.log("Player pass: ", data)
     },
    onRoundEnd: (data) => { 
        console.log("Round ended: ", data)
        gamePhaseData = data
        currentGamePhase.value = 'round_end'
     },
    onStartGame: (data) => { 
        console.log("Game started: ", data)
        gameTracker.totalRounds.value = data.totalRounds
     },
    onTurnStart: (data) => { 
        console.log("Turn started: ", data)

        gameTracker.wasWordCorrect.value = null

        gamePhaseData = data

        currentGamePhase.value = 
            data.activePlayerId === socket.getClientId()
            ? 'active_turn'
            : 'other_player_turn'
    },
    onWordResult: (data) => { 
        console.log("Word result: ", data)

        if(!gameTracker.expectWordCheck){
            console.warn("Got word result event when not waiting for it")
            return
        }

        gameTracker.wasWordCorrect.value = data.success
    },
    onGameSync: data => {
        console.log("Game sync: ", data)
    }
}) : null

// console.log(thisGameSocket);
// const userId = socket.getClientId()

function sendUserWord(word: string){
    if(!isActiveUser){
        console.warn("User is not an active user.")
        return
    }

    if(wrappedGameSocket === null){
        console.error("Wrapped socket is null when submitting user word")
    }
    
    wrappedGameSocket?.submitWord(word)
}

const gameScreenRef = useTemplateRef('game-screen')

watch(gameTracker.wasWordCorrect, (value) => {
    if(value === false){
        gameScreenRef.value?.setWordError("This word is incorrect")
    }
})

let caption = new Map<GamePhases, string>([
    ['waiting_for_game', 'Patiently waiting...'],
    ['active_turn', 'Choose your word'],
    ['other_player_turn', 'Other player is choosing a word...'],
    ['game_over', 'All good things come to an end'],
    ['round_end', 'Round results']
]).get(currentGamePhase.value) ?? '---';


</script>

<template>
    <main class="word-in-sentence">
        <InfoBar 
            :total-rounds="gameTracker.totalRounds.value"
            :current-round="gameTracker.currentRound.value"
            :roundPoints="gameTracker.turnPoints.value"
            :gamePoints="gameTracker.roundPoints.value"
            :socket-connected="socketConnected"
            :caption="caption"
        />

        <GameScreen 
            v-if="currentGamePhase === 'active_turn' || currentGamePhase === 'other_player_turn'" 
            :is-active="currentGamePhase === 'active_turn'"
            :game-tracker="gameTracker" 
            ref="game-screen" 
            @word-submit="sendUserWord"
        />

        <WaitingForStartScreen v-else-if="currentGamePhase === 'waiting_for_game'" />

        <RoundEndScreen v-else-if="currentGamePhase === 'round_end'"/>

        <GameOverScreen v-else-if="currentGamePhase === 'game_over'"/>
        
    </main>
</template>

<style lang="scss" scoped>

.word-in-sentence{
    background-image: linear-gradient(to bottom right, #58e6bb, #ebbe43);

    height: 100%;
    width: 100%;

    display: grid;
    grid-template-rows: min-content auto;
    justify-items: center;
    gap: 2rem;

    overflow-x: hidden;
    position: relative;
}
</style>