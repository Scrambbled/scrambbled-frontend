 <script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useGameSocket } from '../../api/socket/Socket'
import { wordsInSentenceSocketWrapper } from './socket_wrapper'
import type { TurnStartPayload } from './DTOs'

const gamePhases = ['game_over', 'active_turn', 'other_player_turn', 'round_end'] as const
type GamePhases = typeof gamePhases[number]
let currentGamePhase = ref<GamePhases | null>(null)
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
        gameTracker.sentence.value = (gamePhaseData as TurnStartPayload).baseSentence
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
}) : null

// console.log(thisGameSocket);
const userId = socket.getClientId()

const userWord = ref("")

function letterTileClick(e: PointerEvent, letter: string){
    if(gameTracker.lettersLeft.size === 0){
        return
    }

    clearWordError()

    if(!gameTracker.lettersLeft.has(letter)){
        console.error(`Clicked tile with letter '${letter}', which is not in the sentence`)
        return
    }

    if(e.target === null){
        return
    }

    const target = e.target as HTMLElement

    const alreadyActive = target.classList.contains("active")

    if(alreadyActive){
        target.classList.remove("active")
        gameTracker.lettersLeft.set(letter, gameTracker.lettersLeft.get(letter) as number + 1)

        const letterIndex = userWord.value.lastIndexOf(letter)

        if(letterIndex === -1){
            console.error(`Tried to remove '${letter}' from userWord, but its not present`)
            return
        }

        userWord.value = userWord.value.slice(0, letterIndex) + userWord.value.slice(letterIndex + 1)
        
    } else {
        target.classList.add("active")

        if(gameTracker.lettersLeft.get(letter) === 0){
            console.error(`No more '${letter}' letters in lettersLeft`)
            return
        }

        gameTracker.lettersLeft.set(letter, gameTracker.lettersLeft.get(letter) as number - 1)
        userWord.value += letter
    }
    
    console.log(gameTracker.lettersLeft);
}

function sendUserWord(){
    if(!isActiveUser){
        console.warn("User is not an active user.")
        return
    }

    if(wrappedGameSocket === null){
        console.error("wrapped socket is null when submitting user word")
    }

    console.log("SENDING A WORD");
    

    wrappedGameSocket?.submitWord(userWord.value)
}

const letterButtonsRef = useTemplateRef("letter-btn")

function clearUserInput(){
    if(!letterButtonsRef.value){
        return
    }

    for(const letterButton of letterButtonsRef.value){
        letterButton.classList.remove("active")
    }

    userWord.value = ""
}

watch(gameTracker.wasWordCorrect, (value) => {
    if(value === false){
        setWordError("This is not a correct word")
    }
})

let wordError = ref<null | string>(null)

function setWordError(error: string){
    wordError.value = error
}

function clearWordError(){
    wordError.value = null
}


</script>

<template>
    <main class="word-in-sentence">

        <header class="game-info framed-box">
            <p class="round">
                <span class="current-round">{{ gameTracker.currentRound }}</span>
                /
                <span class="total-rounds">{{ gameTracker.totalRounds }}</span>
            </p>

            <p>{{ socketConnected ? 'Connected': 'Disconnected' }}</p>

            <p class="points">
                {{ gameTracker.turnPoints }} / {{ gameTracker.roundPoints }}
            </p>
        </header>

        <section class="user-word">
            <p class="entered-word">{{ userWord }}</p>
            <button @click.prevent="clearUserInput()" class="clear"></button>
            <p :class="'word-error' + (wordError ? ' active' : '')">Error: {{ wordError }}</p>

            <button class="submit-user-word press-in-button" @click="sendUserWord()">Submit</button>
        </section>

        <ul class="words">
            <li v-if="gameTracker.words.value !== null" class="word" v-for="word in gameTracker.words.value">
                <ul class="letters">
                    <li class="letter" v-for="letter in word.split('')">
                        <button class="letter-tile" ref="letter-btn" @click.prevent="e => letterTileClick(e, letter)">{{ letter }}</button>
                    </li>
                </ul>
            </li>
        </ul>

        <ul class="used-words">
            <li class="used-word" v-for="word in gameTracker.usedWords.value">{{ word }}</li>
        </ul>
    </main>
</template>

<style lang="scss" scoped>

.word-in-sentence{
    background-image: linear-gradient(to bottom right, #58e6bb, #ebbe43);

    height: 100%;

    display: grid;
    grid-template-rows: min-content min-content min-content auto;
    justify-items: center;
}

.game-info{
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    color: white;

    display: grid;
    grid-template-columns: min-content auto min-content;
    align-items: center;

    padding-block: .25rem;

    width: 90%;

    & .round{
        font-size: 2rem;

        display: flex;
        align-items: center;

        gap: .25rem;

        color: #fffc;

        & .current-round{
            font-size: 3rem;

            font-weight: bold;
            color: white;
        }
    }

    & .points{
        font-size: 2rem;
    }
}

.user-word{
    --_input-height: 3rem;
    width: 50%;

    display: grid;
    grid-template-columns: min(90%, 40rem) min-content min-content;
    grid-template-rows: var(--_input-height) 2rem;
    grid-template-areas: 
        "user-in clear submit"
        "error error .";

    isolation: isolate;

    & .entered-word{
        grid-area: user-in;

        box-sizing: content-box;
        border-bottom: .25rem solid #8f64b3;

        border-radius: 1rem 0 0 1rem;

        display: grid;
        grid-template-columns: auto min-content;
        align-content: center;
        gap: .5rem;

        padding: .5rem;

        background-color: #fff;

        height: calc(var(--_input-height) - .5rem * 2);

        text-transform: uppercase;
    }

    & .clear{
        grid-area: clear;

        box-sizing: content-box;
        width: var(--_input-height);
        height: var(--_input-height);

        border: 0;
        background-color: white;

        border-bottom: .25rem solid #8f64b3;

        border-radius: 0 1rem 1rem 0;

        position: relative;

        // border-left: 1px solid #8f64b3;

        transition: transform .2s, border-bottom-width .2s, box-shadow .2s;

        &:hover,
        &:focus-visible{
            border-bottom-width: .15rem;
            transform: translateY(.1rem);

            box-shadow: inset .1rem 0rem 0 #0003;

            cursor: pointer;
        }

        &:active{
            border-bottom-width: 0rem;
            transform: translateY(.25rem);

            box-shadow: inset .25rem 0rem 0 #0003;

            cursor: pointer;
        }

        &::after{
            content: '';
            
            position: absolute;
            inset: 10%;

            background-color: #8f64b3;
            mask-image: url("/img/cross.svg");
            mask-size: contain;

            border-radius: inherit;
        }
    }

    & .word-error{
        grid-area: error;

        background-color: rgb(231, 74, 74);
        color: white;
        width: 95%;

        justify-self: center;

        border-radius: 0 0 .5rem .5rem;

        padding-inline: .5rem;

        border-bottom: .25rem solid #0003;

        transform: translateY(-100%);
        z-index: -1;

        transition: transform .2s ease-in-out;

        &.active{
            transform: translateY(0);
        }
    }

    & .submit-user-word{
        grid-area: submit;
        margin-left: 1rem;
    }
}

.words, .letters{
    list-style-type: none;
    display: flex;
}

.words{
    gap: 3rem;
    flex-wrap: wrap;
    justify-content: center;

    width: 80%;
}

.letters{
    gap: .5rem;
}

.letter-tile{
    position: relative; 

    box-sizing: content-box;

    width: 3rem;
    height: 3rem;

    font-size: 2rem;

    background-color: #ebd09e;

    border-radius: 1rem;

    border: 0;
    outline: 0;

    color: white;
    text-transform: uppercase;

    border-bottom: .3rem solid #0001;
    box-shadow: inset 0 .2rem 0 #fff8;

    transition: transform .1s linear, border-bottom-width .1s linear;

    cursor: pointer;

    &:hover,
    &:focus-visible{
        transform: translateY(.15rem);
        border-bottom-width: .15rem;
    }

    &.active{
        background-color: hsl(39, 46%, 57%);
        box-shadow: inset 0 .2rem 0 #fff6;

        transform: translateY(.2rem);
        border-bottom-width: 0;
    }
}

.used-words{
    list-style-type: none;

    display: grid;
    grid-auto-rows: min-content;
    gap: .25rem;

    background-color: #fff;
    padding: .5rem;

    color: #5c5858;

    width: 80%;

    border-radius: .75rem .75rem 0 0;

    & .used-word{
        border-bottom: 2px solid #8f64b3;
        padding-left: .25rem;

        text-transform: uppercase;
    }
}

</style>