<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useApiHandler } from '../api/ApiHandler';
import { useGameState } from '../game_state';
import { getFrontGameData } from '../games/Games';
import { router } from '../router';


defineEmits<{
    join: [accessCode: string]
}>()



</script>

<template>
    <div class="join-game-menu">
        <input ref="accessCodeInput" type="text" class="text-input" pattern="[a-zA-Z0-9]{6}" placeholder="Access Code">
        <button class="press-in-button">Join Game</button>
    </div>
</template>

<style lang="scss" scoped>
.join-game-menu{
    display: grid;
    gap: 1rem;
    align-content: center;
}
</style>