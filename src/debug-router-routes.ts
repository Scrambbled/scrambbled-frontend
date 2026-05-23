import ScrabbleComponentShowcase from "./games/scrabble/ComponentShowcase.vue";
import ScrabbleGameScreen from "./games/scrabble/GameScreen.vue";
import GameSetupScreen from "./games/scrabble/GameSetupScreen.vue";
import WordInSentence from "./games/word_in_sentence/WordInSentence.vue";

export const debugRoutes = [
    {path: "/words_in_words", component: WordInSentence},

    {path: '/scrabble/showcase', component: ScrabbleComponentShowcase},
    {path: '/scrabble/game', component: ScrabbleGameScreen},
    {path: '/scrabble/setup', component: GameSetupScreen},
]