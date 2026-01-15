<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../api/ApiHandler';
import type { UserIcon, UserProfileData } from '../types/user_types';
import { getRandomName } from '../misc/usernames';

defineEmits<{
    change: [data: UserProfileData]
}>();


const apiHandler = useApiHandler()

const username = ref(getRandomName())

const selectedIconIndex = ref(-1)
let userIcons: UserIcon[] = []

function nextUserIcon(){
    selectedIconIndex.value = (selectedIconIndex.value + 1) % userIcons.length
}

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
    <div class="profile-edit">
        <div class="profile-icon">
            <img :src="userIcons[selectedIconIndex]?.path">
            <button class="re-roll-pfp re-roll-button" @click.prevent="nextUserIcon">
            </button>
        </div>

        <input type="text" class="username text-input" placeholder="Username" :value="username">
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
        }
    }

    .re-roll-pfp{
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
</style>