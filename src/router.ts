import {createRouter, createWebHistory} from 'vue-router'

import HomeView from './views/HomeView/HomeView.vue'
import WordInSentence from './games/word_in_sentence/WordInSentence.vue'
import Game from './games/Game.vue'
import { debugRoutes } from './debug-router-routes'

const routes = [
    {path: "/game", component: Game},
    {path: "/", component: HomeView},
    {path: "/word", component: WordInSentence},
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

// Add debug routes to view components
if(import.meta.env.VITE_DEBUG){
    for(const route of debugRoutes){
        router.addRoute({path: `/debug${route.path}`, component: route.component})
    }
}