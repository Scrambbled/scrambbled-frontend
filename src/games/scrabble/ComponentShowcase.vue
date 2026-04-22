<script setup lang="ts">
import LetterTile from './LetterTile.vue';
import LetterTray from './LetterTray.vue';

</script>

<template>
    <main class="showcase">
        <LetterTile :letter-tile="{letter: 'A', points: 1}"/>
        <LetterTray :max-tiles="8"/>
    </main>
</template>

<style scoped lang="scss">
.showcase{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>