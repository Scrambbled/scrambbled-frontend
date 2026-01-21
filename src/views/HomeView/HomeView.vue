<script setup lang="ts">
import { ref, useTemplateRef, warn } from "vue";
import ProfileEdit from "../../components/ProfileEdit.vue";
import { useSocket } from "../../api/socket/Socket";

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


const socket = useSocket()
const accessCodeRef = useTemplateRef("accessCode")

function connect(){
    let accessCode = accessCodeRef.value?.value

    if(accessCode === undefined || accessCode.match(/[a-zA-Z0-9]{6}/) === null){
        console.warn("Incorrect Access Code");
        return
    }

    socket.connect(accessCode)
}

</script>

<template>
    <div class="home-view">
        <div class="session framed-box">
            <div class="moving-frame" :style="{'--frame': currentMenuIndex}">
                <div class="create-session-menu">
                    No thoughts… Menu empty :drooling:
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

       <ProfileEdit class="framed-box"/>
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