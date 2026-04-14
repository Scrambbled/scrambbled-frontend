<script setup lang="ts">
import { ref } from 'vue';


const word = ref("defenestration")
const letters = word.value.split('')

const foundWords = ref<string[]>([])

</script>

<template>
    <main class="word-in-word-game">
        <header class="session-info framed-box">
            Current Word:
            <h2 class="current-word">{{ word }}</h2>
        </header>

        <section class="board">
            <ul class="letters" :style="{'--_letter-count': letters.length}">
                <li class="letter" v-for="letter, i in letters" :style="{'--_nth': i}">
                    <button>{{ letter }}</button>
                </li>
            </ul>
        </section>

        <ul class="found-words">
            <li class="word" v-for="word in foundWords">{{ word }}</li>
        </ul>

    </main>
</template>

<style lang="scss" scoped>

.word-in-word-game{
    display: grid;
    align-items: center;

    // Mobile view
    grid-template-rows: min-content auto min-content;
    grid-template-areas: "header" "board" "found-words";
}

.session-info{
    text-align: center;

    padding-block: 1rem;

    background-color: #429d73;

    border-top: 0;
    border-radius: 0 0 1rem 1rem;

    .current-word{
        text-transform: uppercase;
    }
}

.board{
    display: grid;
    place-content: center;

    .letters{
        --_angle-offset-per-letter: calc(360deg / var(--_letter-count));
        --_board-radius: 10rem;

        width: calc(2 * var(--_board-radius));
        aspect-ratio: 1;

        border-radius: 50%;

        background-color: #429d73;

        position: relative;

        list-style-type: none;

        .letter{
            --_angle-offset: calc(var(--_angle-offset-per-letter) * var(--_nth));
            --_x: calc(sin(var(--_angle-offset)) * var(--_board-radius));
            --_y: calc(cos(var(--_angle-offset)) * var(--_board-radius));

            position: absolute;

            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            translate: var(--_x) var(--_y);

            button{
                width: min-content;
            }
        }
    }
}

</style>