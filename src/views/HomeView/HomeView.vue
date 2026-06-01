<script setup lang="ts">
import { onMounted, ref, useTemplateRef, warn } from "vue";
import ProfileEdit from "../../components/ProfileEdit.vue";
import { useGameSocket } from "../../api/socket/Socket";
import type { UserProfileData } from "../../types/user_types";
import { useRouter } from "vue-router";
import { useApiHandler } from "../../api/ApiHandler";
import { getFrontGameData, type GameFrontData, type SupportedGame } from "../../handle_game";
import { router } from "../../router";
import { useGameState } from "../../game_state";

const currentMenuIndex = ref(1)

type FrameType = "main-menu" | "create-session" | "join-game"
function moveTo(frame: FrameType){
    const frameIndexMap: {[key in FrameType]: number} = {
        "create-session": 0,
        "main-menu": 1,
        "join-game": 2
    }

    currentMenuIndex.value = frameIndexMap[frame]
}


const socket = useGameSocket()
const accessCodeRef = useTemplateRef("accessCode")

function connect(){
    let accessCode = accessCodeRef.value?.value

    if(accessCode === undefined || accessCode.match(/[a-zA-Z0-9]{6}/) === null){
        console.warn("Incorrect Access Code");
        return
    }

    router.push(`/game?accessCode=${accessCode}`)
}

const gameState = useGameState()

function updateProfileData(profileData: UserProfileData){
    gameState.setUserProfileData(profileData)
}

const apiHandler = useApiHandler();

const games = ref<GameFrontData[]>([])

onMounted(() => {
    apiHandler.getAllGames(_games => {
        games.value = _games
                .map(gameData => getFrontGameData(gameData.gameId))
                .filter(game => game !== null)
    })
})

function createGame(gameId: SupportedGame){
    apiHandler.createGameSession(gameId, accessCode => {
        router.push({path: '/game', query: {accessCode}})
    })
}

</script>

<template>
    <div class="home-view">
        <div class="session framed-box">
            <div class="moving-frame" :style="{'--frame': currentMenuIndex}">
                <div class="create-session-menu">
                    <button class="round-image-button go-back-button" @click.prevent="moveTo('main-menu')"></button>
                    <ul class="game-list">
                        <li class="game-list__entry" v-for="game in games">
                            <button class="create-session" @click="createGame(game.gameId)">{{ game.name }}</button>
                        </li>
                    </ul>
                </div>
                <div class="main-menu">
                    <button class="session-button press-in-button" @click.prevent="moveTo('join-game')">Join Game</button>
                    <button class="session-button press-in-button" @click.prevent="moveTo('create-session')">Create Session</button>
                </div>
                <form class="join-game-menu" @submit.prevent="connect()">
                    <input type="text" ref="accessCode" class="session-code text-input" spellcheck="false" autocomplete="off" placeholder="Join Code" pattern="[a-zA-Z0-9]{6}">
                    <button class="session-button press-in-button">Join Game</button>
                    <button class="round-image-button go-back-button" @click.prevent="moveTo('main-menu')"></button>
                </form>
            </div>
        </div>

       <ProfileEdit @change="updateProfileData" class="framed-box"/>
    </div>
</template>

<style lang="scss" scoped>
.home-view{
    height: 100%;

    background-image: linear-gradient(to bottom right, #58e6bb, #ebbe43);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 3rem;
}

.create-session{
    border: .25rem solid white;
    border-radius: 1rem;

    background: transparent;
    color: white;
    outline: 0;

    cursor: pointer;

    transition: background-color .2s;

    margin-bottom: 1rem;

    padding: .5rem 1rem;

    &:hover{
        background-color: #fff4;
    }
}

.game-list{
    padding-top: 4rem;

    list-style-type: none;
}

.session, .profile-edit{ 
    width: 300px;
    height: 500px;
}

.main-menu, .join-game-menu{
    display: grid;
    grid-template-rows: repeat(2, 4rem);
    gap: 1rem;
    align-content: center;
}

.session{
    position: relative;
    overflow-x: hidden;
}

.create-session-menu{
    display: grid;
    grid-auto-rows: min-content;

    & .go-back-button{
        left: 0;
        transform: scaleX(-1);
    }
}

.moving-frame{
    --frame: 0;

    height: 100%;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%;

    transform: translateX(calc(var(--frame) * -100%));

    transition: transform 250ms ease-in-out;

    & > *{
        padding: 1rem;
        height: 100%;

        position: relative;
    }
}



.go-back-button{
    --_image: url('/img/arrow_loop_left.svg');
    
    position: absolute;
    top: 0;
    right: 0;
}
</style>