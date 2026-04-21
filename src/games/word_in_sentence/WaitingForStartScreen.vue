<script setup lang="ts">
import { useGameSocket } from '../../api/socket/Socket';


const {isHost, accessCode} = defineProps<{isHost: boolean, accessCode: string}>()

const socket = useGameSocket()

function handleGameStart(e: SubmitEvent){
    const form = e.target as HTMLFormElement | null

    if(form === null){
        console.warn('Unable to submit start game form, as event\'s target is empty')
        return
    }

    const data = new FormData(form)

    const rounds = data.get('rounds') as string
    if(rounds === null){
        console.warn("Field 'rounds' is not set on form data")
        return
    }

    const roundsInt = parseInt(rounds)
    if(Number.isNaN(roundsInt)){
        console.warn("Field 'rounds' is not an int")
        return
    }
    
    socket.sendGameSpecificEvent('start_game', { rounds: roundsInt, mode: 'sentence'})
}

</script>

<template>

<h2 v-if="!isHost" class="message waiting-spinner framed-box">
    Waiting for the game to start
</h2>

<form v-else class="game-setup framed-box" @submit.prevent="handleGameStart">
    <h2>{{ accessCode }}</h2>
    <label>
        Rounds: 
        <input type="number" name="rounds" value="3">
    </label>

    <button type="submit">Start</button>
</form>

</template>

<style lang="scss">
@property --turn-end{
    syntax: "<angle>";
    inherits: true;
    initial-value: 0deg;
}

@property --turn-start{
    syntax: "<angle>";
    inherits: true;
    initial-value: 0deg;
}
</style>

<style lang="scss" scoped>
.game-setup{
    align-self: center;
}

.message{
    font-size: min(3.5rem, max(2rem, calc(100vw / 18)));

    color: white;
    // text-shadow: 0 0 .2rem #0007;

    display: grid;
    justify-items: center;
    gap: 2rem;

    align-self: center;

    // Offset so it looks more centered
    margin-bottom: 10rem;
}

.waiting-dots::after{
    content: '';
    animation: waiting-dots 3s linear infinite forwards;
}

@keyframes waiting-dots {
    0%{
        content: '.'
    }

    32%{
        content: '.'
    }

    33%{
        content: '..'
    }

    65%{
        content: '..'
    }

    66%{
        content: '...'
    }

    100%{
        content: '...'
    }
}

.waiting-spinner::after{
    content: '';

    display: inline-block;

    width: 4rem;
    height: 4rem;

    border-radius: 50%;

    background-image: conic-gradient(
        at 50% 50%,
        transparent calc(var(--turn-start) - 1deg),
        white var(--turn-start),
        white var(--turn-end),
        transparent calc(var(--turn-end) + 1deg)
    );

    animation: spinning-conic-gradient 3s ease-in-out forwards infinite;
}

@keyframes spinning-conic-gradient {
    0% {
        --turn-end: 0deg;
    }
    50%{
        --turn-end: 360deg;
        --turn-start: 0deg;
    }
    100%{
        --turn-end: 360deg;
        --turn-start: 360deg;
    }
}
</style>