<script setup lang="ts">
import { ref } from 'vue';
import type { ConfigureGamePayload, SupportedConfigLanguages } from './DTOs';
import { useGameState } from '../../game_state';
import type { ScrabbleState } from './scrabble_state';

const gameState = useGameState()

export interface GameSetup{
    config: ConfigureGamePayload,
    customDict?: File,
    customScores?: File,
}

const emit = defineEmits<{
    startGameClicked: [data: GameSetup] 
}>()

const {state} = defineProps<{state: ScrabbleState}>()

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

const customLanguageBoxClasses = ref(new Set(['custom-language', 'hidden']))

function selectLanguage(language: string){
    if(language === 'custom'){
        customLanguageBoxClasses.value.delete('hidden')
    }
    else{
        customLanguageBoxClasses.value.add('hidden')
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
        ['short', 0.05],
        ['medium', 1],
        ['long', 1.5],
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
    <section class="setup-screen framed-box">
        <div class="player-list-box">
            <h2>Players | {{ gameState.getAccessCode() }}</h2>
            <ul class="player-list">
                <li v-for="player in state.playersAndPoints.value" class="player">
                    <img :src="'/api' + player.player.iconUrl" alt="" class="icon">
                    <p class="nickname">{{ player.player.nickname }}</p>
                </li>
            </ul>
        </div>


        <form class="game-setup" @submit.prevent="submitGameSetup">
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

        <div v-if="!gameState.isHost()" class="form-overlay"></div>
    </section>
</template>

<style lang="scss" scoped>

.setup-screen{
    display: grid;
    grid-template-columns: 1fr 1fr;

    position: relative;
}

.player-list-box{
    display: grid;
    grid-template-rows: min-content auto;
}

.player-list{
    overflow-y: scroll;
}

.player{
    display: grid;
    grid-template-columns: min-content auto;
    align-content: center;

    & .icon{
        width: 3rem;
        height: 3rem;

        object-fit: cover;

        border-radius: 50%;

        overflow: hidden;
    }

    & .nickname{

    }
}

.form-overlay{
    background-color: rgba(64, 64, 64, 0.467);

    position: absolute;
    inset: 0;

    grid-column: 2;

    border-radius: 0 1rem 1rem 0;
}

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