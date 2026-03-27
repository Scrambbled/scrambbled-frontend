import {createMemoryHistory, createRouter} from 'vue-router'

import HomeView from './views/HomeView/HomeView.vue'
import WordInSentence from './games/word_in_sentence/WordInSentence.vue'

const routes = [
    { path: "/", component: HomeView},
    {path: "/word", component: WordInSentence}
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes
})