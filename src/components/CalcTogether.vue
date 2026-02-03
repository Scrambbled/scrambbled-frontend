<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSocket } from '../api/socket/Socket';
import { useGameState } from '../game_state';

let users = new Map<string, string>()

const socketWrapper = useSocket()
const socket = socketWrapper.getSocket()

const gameState = useGameState()

const formula = ref("")
let formulaIsResult = false

onMounted(() => {
    socket.on("user-joined", (data) => {
        users.set(data.userId, "")
    })

    socket.on("user-left", (data) => {
        users.delete(data.userId)
    })

    socket.on("entered-symbol", (data) => {
        if(formulaIsResult){
            formulaIsResult = false
            formula.value = ""
        }
        formula.value = formula.value + data.symbol
        console.log("Symbol entered by: ", data.user.userId);
        
    })

    socket.on("submit-clicked", (data) => {
        console.log(data.result, ", By: ", data.user.userId);
        formula.value = data.result
        formulaIsResult = true
    })
})

function addSymbol(symbol: string){
    socket.emit("game-specific-event", {eventName: "entered-symbol", data: { symbol: symbol }})
}

function submit(){
    socket.emit("game-specific-event", { eventName: "submit-clicked", data: {} })
}

</script>

<template>

    <h2>{{ gameState.getAccessCode() }}</h2>

    <ul>
        <li v-for="user in users.entries()">{{ user[0] }}</li>
    </ul>

    <div class="calc">
        <div class="formula">{{ formula }}</div>
        <div class="buttons">
            <button @click.prevent="addSymbol('1')">1</button>
            <button @click.prevent="addSymbol('2')">2</button>
            <button @click.prevent="addSymbol('3')">3</button>
            <button @click.prevent="addSymbol('4')">4</button>
            <button @click.prevent="addSymbol('5')">5</button>
            <button @click.prevent="addSymbol('6')">6</button>
            <button @click.prevent="addSymbol('7')">7</button>
            <button @click.prevent="addSymbol('8')">8</button>
            <button @click.prevent="addSymbol('9')">9</button>
            <button @click.prevent="addSymbol('0')">0</button>
            <button @click.prevent="addSymbol('+')">+</button>
            <button @click.prevent="addSymbol('-')">-</button>
            <button @click.prevent="addSymbol('/')">/</button>
            <button @click.prevent="addSymbol('*')">*</button>
            <button @click.prevent="submit()">ENTER</button>
        </div>
    </div>

</template>

<style lang="scss" scoped>

.calc{
    display: grid;
    grid-template-rows: 1fr 3fr;

    width: 20rem;

    gap: 1rem;

    .formula{
        border: 2px solid black;
        padding: .25rem;
        border-radius: .25rem;
    }

    .buttons{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(5, 1fr);
        grid-template-areas: 
            "one two three plus"
            "four five six plus"
            "seven eight nine minus"
            "zero multiply divide minus"
            "enter enter enter enter"
        ;

        & > button:nth-child(1) { grid-area: one; }
        & > button:nth-child(2) { grid-area: two; }
        & > button:nth-child(3) { grid-area: three; }
        & > button:nth-child(4) { grid-area: four; }
        & > button:nth-child(5) { grid-area: five; }
        & > button:nth-child(6) { grid-area: six; }
        & > button:nth-child(7) { grid-area: seven; }
        & > button:nth-child(8) { grid-area: eight; }
        & > button:nth-child(9) { grid-area: nine; }
        & > button:nth-child(10) { grid-area: zero; }
        & > button:nth-child(11) { grid-area: plus; }
        & > button:nth-child(12) { grid-area: minus; }
        & > button:nth-child(13) { grid-area: multiply; }
        & > button:nth-child(14) { grid-area: divide; }
        & > button:nth-child(15) { grid-area: enter; }
    }
}

</style>