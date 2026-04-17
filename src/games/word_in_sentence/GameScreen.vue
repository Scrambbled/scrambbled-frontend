<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { GameTracker } from './WordInSentence.vue';


const {gameTracker} = defineProps<{gameTracker: GameTracker}>()

const emit = defineEmits<{wordSubmit: [word: string]}>()

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

let wordError = ref<null | string>(null)

function setWordError(error: string){
    wordError.value = error
}

function clearWordError(){
    wordError.value = null
}

defineExpose({
    setWordError
});


</script>

<template>
    <section class="user-word">
        <p class="entered-word">{{ userWord }}</p>
        <button @click.prevent="clearUserInput()" class="clear"></button>
        <p :class="'word-error' + (wordError ? ' active' : '')">Error: {{ wordError }}</p>

        <button class="submit-user-word press-in-button" @click="emit('wordSubmit', userWord)">Submit</button>
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
</template>

<style lang="scss" scoped>
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