<script setup lang="ts">
import "./HomeView.scss"
import ProfileEdit from "../../components/ProfileEdit.vue";

</script>

<template>
    <div class="home-view">
        <div class="session framed-box">
            <button class="session-button press-in-button">Join Game</button>
            <button class="session-button press-in-button">Create Session</button>
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

.session{
    display: grid;
    grid-template-rows: repeat(2, 4rem);
    gap: 1rem;
    align-content: center;
}
</style>