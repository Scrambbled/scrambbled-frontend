<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

const gameState = {
    totalRounds: ref(10),
    currentRound: ref(3),

    points: ref(37),

    usedWords: ref<string[]>(["test", "sentence"]),
}

const sentence = "Test sentence for word making".toLowerCase()
const words = sentence.split(" ")

const userWord = ref("")

// Count up letters in sentence
const lettersLeft = words
    .flatMap(word => word.split(''))
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

function letterTileClick(e: PointerEvent, letter: string){
    if(!lettersLeft.has(letter)){
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
        lettersLeft.set(letter, lettersLeft.get(letter) as number + 1)

        const letterIndex = userWord.value.lastIndexOf(letter)

        if(letterIndex === -1){
            console.error(`Tried to remove '${letter}' from userWord, but its not present`)
            return
        }

        userWord.value = userWord.value.slice(0, letterIndex) + userWord.value.slice(letterIndex + 1)
        
    } else {
        target.classList.add("active")

        if(lettersLeft.get(letter) === 0){
            console.error(`No more '${letter}' letters in lettersLeft`)
            return
        }

        lettersLeft.set(letter, lettersLeft.get(letter) as number - 1)
        userWord.value += letter
    }
    
    console.log(lettersLeft);
    
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


</script>

<template>
    <main class="word-in-sentence">

        <header class="game-info framed-box">
            <p class="round">
                <span class="current-round">{{ gameState.currentRound }}</span>
                /
                <span class="total-rounds">{{ gameState.totalRounds }}</span>
            </p>

            <p></p>

            <p class="points">
                {{ gameState.points }}
            </p>
        </header>

        <section class="user-word">
            <p class="entered-word">
                <span>{{ userWord }}</span>
                <button @click.prevent="clearUserInput()" class="clear round-image-button"></button>
            </p>
        </section>

        <ul class="words">
            <li class="word" v-for="word in words">
                <ul class="letters">
                    <li class="letter" v-for="letter in word.split('')">
                        <button class="letter-tile" ref="letter-btn" @click.prevent="e => letterTileClick(e, letter)">{{ letter }}</button>
                    </li>
                </ul>
            </li>
        </ul>

        <ul class="used-words">
            <li class="used-word" v-for="word in gameState.usedWords.value">{{ word }}</li>
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
    width: 50%;

    & .entered-word{
        border-bottom: .25rem solid #8f64b3;

        border-radius: 1rem;

        display: grid;
        grid-template-columns: auto min-content;
        align-content: center;
        gap: .5rem;

        padding: .5rem;

        background-color: #fff;

        & .clear{
            --_image: url("/img/cross.svg");

            width: 2rem;
            height: 2rem;

            opacity: 0.8;
        }
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