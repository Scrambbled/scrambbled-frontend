<script setup lang="ts">
import { toRef, computed } from 'vue'


export interface WordInfo{
    isCorrect: boolean,
    error: 'incorrect_placement' | 'must_contain_starting_square' | 'unknown_word' | 'none',
    points: number,
}

const props = defineProps<{playerCount: number, points: number, wordInfo: WordInfo | null}>()

const wordInfo = toRef(props, 'wordInfo')

const showWordInfo = computed(() => wordInfo.value !== null)

const wordInfoClass = computed(() => {
    const classes = ['word-info']
    if(showWordInfo.value) classes.push('shown')
    if(wordInfo.value !== null){
        if(wordInfo.value.isCorrect) classes.push('correct')
        else classes.push('incorrect')
    }
    return classes.join(' ')
})

const wordInfoCaptions = new Map([
    ['incorrect_placement', 'Tile is placed incorrectly'],
    ['must_contain_starting_square', 'Word is not on starting square'],
    ['unknown_word', 'Unknown word'],
])

const wordInfoCaption = computed(() => {
    if(wordInfo.value === null) return '---'
    if(wordInfo.value.isCorrect) return `Correct word! Points: ${wordInfo.value.points}`
    return wordInfoCaptions.get(wordInfo.value.error) ?? wordInfo.value.error
})

</script>

<template>
    <header class="top-bar">
        <p class="player-count">Players: {{ props.playerCount }}</p>
        <h1 class="title">SCRABBLE</h1>
        <p class="points">Points: {{ props.points }}</p>

    <!-- <p :class="wordInfoClass">{{ wordInfoCaption }}</p> -->
    </header>
</template>


<style lang="scss" scoped>
.top-bar{
    position: relative;

    display: grid;
    grid-template-columns: min-content auto min-content;
    align-items: center;

    background-color: hsla(34, 53%, 41%);

    border-radius: 0 0 1rem 1rem;

    outline: .25rem solid hsla(34, 53%, 61%);
    padding: .25rem 1rem;

    color: white;
}

.title{
    text-align: center;
    letter-spacing: .25rem;
}

.player-count, .points{
    text-wrap: nowrap;
}

.word-info{
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    translate: 0 -100%;

    background-color: hsl(120, 56%, 41%);
    
    padding: .25rem .5rem;

    border-radius: 0 0 .5rem .5rem;

    transition: translate .2s ease-in;
}

.word-info.shown{
    translate: 0 0;
}

.word-info.incorrect{
    background-color: hsl(0, 56%, 41%);
}


</style>