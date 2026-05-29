<script setup lang="ts">
import { useGameState } from '../../game_state';
import type { ScrabbleState } from './scrabble_state';

const {state, maxEntries} = defineProps<{ state: ScrabbleState, maxEntries?: number }>()

const emit = defineEmits<{continue: []}>()

const gameState = useGameState()

// state.playersAndPoints.value = [
//     {points: 20, player: { iconUrl: '/static/user_icons/sock_puppet_blue.png', id: '', nickname: "Buffalo" }},
//     {points: 0, player: { iconUrl: '/static/user_icons/sock_puppet_green.png', id: '', nickname: "Buffalo" }},
//     {points: 243, player: { iconUrl: '/static/user_icons/sock_puppet_blue.png', id: '', nickname: "Buffalo" }},
//     {points: 100, player: { iconUrl: '/static/user_icons/sock_puppet_pink.png', id: '', nickname: "Buffalo" }},
//     {points: 15, player: { iconUrl: '/static/user_icons/sock_puppet_yellow.png', id: '', nickname: "Buffalo" }},
// ]

const sortedCappedPlayers = state.playersAndPoints.value
    .sort((a, b) => b.points - a.points)
    .slice(0, maxEntries ?? 10)

// Crude ordinal postfix
const getOrdinalPostfix = (i: number) => {
    if(i % 10 == 1 && i !== 11) return 'st'
    else if(i % 10 == 2 && i != 12) return 'nd'
    else if(i % 10 == 3 && i !== 13) return 'rd'
    else return 'th'
}

</script>

<template>

    <div class="wrapper">
        <main class="results framed-box">
            <h1>RESULTS</h1>
            <ul class="scoreboard">
                <li v-for="player, i in sortedCappedPlayers" class="scoreboard-entry">
                    <p class="place">{{ i + 1 }}{{ getOrdinalPostfix(i + 1) }}</p>
                    <img :src="'/api' + player.player.iconUrl" alt="" class="icon">
                    <p class="username">{{ player.player.nickname }}</p>
                    <p class="points">{{ player.points }}</p>
                </li>
            </ul>
            <button v-if="gameState.isHost()" @click.prevent="emit('continue')" class="next-round press-in-button">New Game</button>
        </main>
    </div>

</template>

<style lang="scss" scoped>

.wrapper{
    width: 100%;
    height: 100%;

    display: grid;
    place-content: center;
}

.results{
    display: grid;
    grid-template-rows: min-content auto 4rem;
    gap: 1rem;
    justify-items: center;

    color: white;
}

.scoreboard{
    display: grid;
    gap: 1rem;

    padding-inline: 10rem;
}

.scoreboard-entry{
    --_box-shadow-color: #d08ed1;
    display: grid;
    grid-template-columns: min-content 15rem min-content;
    align-items: center;
    gap: 1rem;

    box-shadow: 0 .24rem 0 var(--_box-shadow-color);

    background-color: white;
    border-radius: 1rem;

    color: black;

    padding-inline: 1rem;

    position: relative;

    &:nth-child(1){ --_box-shadow-color: #f2cd47; }
    &:nth-child(2){ --_box-shadow-color: #80c3d9; }
    &:nth-child(3){ --_box-shadow-color: #d38322; }
}

.place{
    position: absolute;
    right: 100%;

    text-align: right;
    color: white;
    font-weight: bold;
    text-wrap: nowrap;

    padding-inline-end: 1rem;
}

.icon{
    width: 3rem;
    height: 3rem;

    border-radius: 50%;

    overflow: hidden;

    object-fit: cover;
}

.username{
    overflow: hidden;

    border-right: .15rem solid var(--_box-shadow-color);
}

.points{
    padding-inline: .5rem;
}

.next-round{

}

</style>