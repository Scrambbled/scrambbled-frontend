<script setup lang="ts">

import "./HomeView.scss"

</script>

<template>
    <div class="home-view">
        <div class="session">
            <button class="session-button">Join Game</button>
            <button class="session-button">Create Session</button>
        </div>


        <div class="profile">
            <div class="profile-icon">
                <img src="" alt="">
                <button class="reroll">
                    <img src="/img/refresh.svg" alt="">
                </button>
            </div>

            <input type="text" class="username" placeholder="Username">
        </div>
    </div>
</template>