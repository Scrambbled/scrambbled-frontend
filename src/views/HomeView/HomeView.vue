<script setup lang="ts">

import { onMounted, ref } from "vue";
import { useApiHandler, type UserIcon } from "../../api/ApiHandler";
import "./HomeView.scss"
import { getRandomName } from "../../misc/usernames";

const apiHandler = useApiHandler()


const selectedIconIndex = ref(-1)
let userIcons: UserIcon[] = []

onMounted(() => {
    apiHandler.getProfileIcons(icons =>{
        userIcons = icons

        if(userIcons.length > 0){
            selectedIconIndex.value = 0;
        }
    })

})

</script>

<template>
    <div class="home-view">
        <div class="session">
            <button class="session-button">Join Game</button>
            <button class="session-button">Create Session</button>
        </div>


        <div class="profile">
            <div class="profile-icon">
                <img :src="userIcons[selectedIconIndex]?.path">
                <button class="reroll" @click.prevent="selectedIconIndex = (selectedIconIndex + 1) % userIcons.length">
                    <img src="/img/refresh.svg" alt="">
                </button>
            </div>

            <input type="text" class="username" placeholder="Username" :value="getRandomName()">
        </div>
    </div>
</template>