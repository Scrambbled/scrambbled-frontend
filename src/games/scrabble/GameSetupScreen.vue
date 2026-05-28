<script setup lang="ts">
import { ref } from 'vue';
import type { ScrabbleSocket } from './socket_wrapper';
import type { ConfigureGamePayload, SupportedConfigLanguages } from './DTOs';

export interface GameSetup{
    config: ConfigureGamePayload,
    customDict?: File,
    customScores?: File,
}

const emit = defineEmits<{
    startGameClicked: [data: GameSetup] 
}>()

const languageOptions: {value: SupportedConfigLanguages, label: string}[] = [
    {value: 'en', label: 'English'},
    {value: 'pl', label: 'Polish'},
    {value: 'custom', label: 'Custom'},
]

const durationOptions = [
    {value: 'short', label: 'Short'},
    {value: 'medium', label: 'Medium'},
    {value: 'long', label: 'Long'},
]

let customLanguageSelected = false
const customLanguageBoxClasses = ref(new Set(['custom-language', 'hidden']))

function selectLanguage(language: string){
    if(language === 'custom'){
        customLanguageBoxClasses.value.delete('hidden')
        customLanguageSelected = true
    }
    else{
        customLanguageBoxClasses.value.add('hidden')
        customLanguageSelected = false
    }
}

function submitGameSetup(e: SubmitEvent){
    if(e.target === null){
        return
    }

    let data = new FormData(e.target as HTMLFormElement)
    let duration = data.get('duration') ?? 'short'
    let language = data.get('language') ?? 'en'
    let customDict: File | null = null
    let customScores: File | null = null

    if(language as string === 'custom'){
        customDict = data.get('custom_language_dictionary') as File | null
        customScores = data.get('custom_language_letter_scores') as File | null
    }

    const multipliers = new Map([
        ['short', 1],
        ['medium', 2],
        ['long', 3],
    ])

    const config = {
        gameLengthMultiplier: (multipliers.get(duration as string) ?? 1), 
        language: language as SupportedConfigLanguages
    }

    emit('startGameClicked', {
        config,
        customDict: customDict ?? undefined,
        customScores: customScores ?? undefined,
    })
}

</script>

<template>
    <form class="game-setup framed-box" @submit.prevent="submitGameSetup">
        <section class="language-select radio-select">
            <label v-for="lang, i in languageOptions" class="language-option radio-option">
                {{ lang.label }}
                <input 
                    type="radio" 
                    name="language" 
                    :checked="i === 0"
                    :value="lang.value" @click="selectLanguage(lang.value)
                ">
            </label>
        </section>

        <section :class="[...customLanguageBoxClasses].join(' ')">
            <label>Dictionary: <input type="file" name="custom_language_dictionary"></label>
            <label>Letter points: <input type="file" name="custom_language_letter_scores"></label>
        </section>

        <section class="duration-select radio-select">
            <label v-for="duration, i in durationOptions" class="duration-option radio-option">
                {{ duration.label }}
                <input type="radio" name="duration" :checked="i === 0" :value="duration.value">
            </label>
        </section>

        <div class="wrapper">
            <button type="submit" class="start-game-button press-in-button">Start Game</button>
        </div>
    </form>
</template>

<style lang="scss" scoped>

.game-setup{
    display: grid;
    gap: 3rem;
}

.radio-select{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

.radio-option{
    --active-color: #703fa8;
    --disabled-color: #777;
    
    border: .25rem solid white;
    border-radius: 1rem;
    
    padding: .25rem .5rem;

    color: white;

    cursor: pointer;

    transition: color .2s, border-color .2s;

    & input[type=radio]{
        width: 0;
        height: 0;
        margin: 0;
    }

    &:has(input[type=radio]:disabled){
        cursor: not-allowed;
        color: var(--disabled-color);
        border-color: var(--disabled-color);
    }

    &:has(input[type=radio]:checked){
        border-color: var(--active-color);
        color: var(--active-color);
    }
}

.custom-language{
    display: grid;
    justify-content: center;

    &.hidden{
        display: none;
        height: 0;
    }
}

.wrapper{
    display: grid;
    justify-content: center;

    height: 3rem;
}

</style>