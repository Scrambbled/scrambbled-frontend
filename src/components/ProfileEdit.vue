<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../api/ApiHandler';
import type { UserIcon, UserProfileData } from '../types/user_types';
import { getRandomName } from '../misc/usernames';

const emit = defineEmits<{
    change: [data: UserProfileData]
}>();


const apiHandler = useApiHandler()

const username = ref(getRandomName())

const selectedIconIndex = ref(-1)
let userIcons: UserIcon[] = []

function nextUserIcon(){
    selectedIconIndex.value = (selectedIconIndex.value + 1) % userIcons.length
    emitChange()
}

onMounted(() => {
    apiHandler.getProfileIcons(icons =>{
        userIcons = icons

        if(userIcons.length > 0){
            selectedIconIndex.value = 0;
            emitChange()
        }
    })
})

function emitChange(){
    if(userIcons.length !== 0 && selectedIconIndex.value !== -1){
        emit("change", {
            iconName: userIcons[selectedIconIndex.value]?.name ?? "No icon available",
            username: username.value
        })
    }
}

function setUsername(e: Event){
    const target = e.target

    if(!target){
        return
    }

    username.value = (e.target as HTMLInputElement).value
    emitChange()
}
</script>

<template>
    <div class="profile-edit">
        <div class="profile-icon">
            <img :src="userIcons[selectedIconIndex]?.path">
            <button class="re-roll-pfp round-image-button" @click.prevent="nextUserIcon">
            </button>
        </div>

        <input type="text" class="username text-input" @change.prevent="setUsername" placeholder="Username" :value="username" autocomplete="false">
    </div>
</template>

<style lang="scss" scoped>
.profile-edit{
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 1rem;

    .profile-icon{
        position: relative;

        background: white;

        width: 10rem;
        height: 10rem;

        border-radius: 100%;

        display: grid;

        & > * {
            grid-column: 1;
            grid-row: 1;
        }

        & > img{
            border-radius: 100%;
            width: 100%;
            height: 100%;
        }
    }

    .re-roll-pfp{
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
</style>