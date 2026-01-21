<script setup lang="ts">
import { ref } from "vue";
import ProfileEdit from "../../components/ProfileEdit.vue";

const currentMenuIndex = ref(1)

</script>

<template>
    <div class="home-view">
        <div class="session framed-box">
            <div class="moving-frame" :style="{'--frame': currentMenuIndex}">
                <div class="create-session-menu">
                    No thoughts… Menu empty :drooling:
                </div>
                <div class="main-menu">
                    <button class="session-button press-in-button" @click.prevent="currentMenuIndex = 2">Join Game</button>
                    <button class="session-button press-in-button" @click.prevent="currentMenuIndex = 0">Create Session</button>
                </div>
                <div class="join-game-menu">
                    <input type="text" class="session-code text-input">
                    <button class="session-button press-in-button">Join Game</button>
                </div>
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
    }
}
</style>