import {createMemoryHistory, createRouter} from 'vue-router'

import HomeView from './views/HomeView/HomeView.vue'
import GameView from './views/HomeView/GameView.vue'

const routes = [
    { path: "/", component: HomeView},
    { path: "/game", component: GameView },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes
})