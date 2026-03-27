<script setup lang="ts">
import { ref } from 'vue'



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


</script>

<template>
    <main class="word-in-sentence">

        <section class="word">
            <p class="entered-word">
                <span>{{ userWord }}</span>
                <button class="clear">x</button>
            </p>
            <button class="backspace press-in-button">BACKSPACE</button>
        </section>

        <ul class="words">
            <li class="word" v-for="word in words">
                <ul class="letters">
                    <li class="letter" v-for="letter in word.split('')">
                        <button class="letter-tile" @click.prevent="e => letterTileClick(e, letter)">{{ letter }}</button>
                    </li>
                </ul>
            </li>
        </ul>
    </main>
</template>

<style lang="scss" scoped>

.word{
    display: flex;
    justify-content: center;

    & .entered-word{
        border: .2rem solid black;

        width: 50vw;

        border-radius: 1rem;

        display: grid;

        grid-template-columns: auto min-content;

        padding-inline: .5rem;

        & .clear{
            background-color: transparent;

            outline: 0;
            border: 0;

            opacity: .6;

            font-size: 2rem;
        }
    }
}

.words, .letters{
    list-style-type: none;
    display: flex;
}

.words{
    gap: 4rem;
    flex-wrap: wrap;
    justify-content: center;
}

.letters{
    gap: .5rem;
}

.letter-tile{
    position: relative; 

    box-sizing: content-box;

    width: 4rem;
    height: 4rem;

    font-size: 3rem;

    background-color: #ebd09e;

    border-radius: 1rem;

    border: 0;
    outline: 0;

    color: white;
    text-transform: uppercase;

    border-bottom: .4rem solid #0001;
    box-shadow: inset 0 .3rem 0 #fff8;

    transition: transform .1s linear, border-bottom-width .1s linear;

    cursor: pointer;

    &:hover,
    &:focus-visible{
        transform: translateY(.2rem);
        border-bottom-width: .2rem;
    }

    &.active{
        background-color: hsl(39, 46%, 57%);
        box-shadow: inset 0 .3rem 0 #fff6;

        transform: translateY(.4rem);
        border-bottom-width: 0;
    }
}

</style>