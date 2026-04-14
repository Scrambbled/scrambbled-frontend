import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'

import HomeView from './views/HomeView/HomeView.vue'
import WordInSentence from './games/word_in_sentence/WordInSentence.vue'
import Game from './games/Game.vue'

const routes = [
    {path: "/game", component: Game},
    { path: "/", component: HomeView},
    {path: "/word", component: WordInSentence},
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})