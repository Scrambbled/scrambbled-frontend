<script setup lang="ts">

const results = [
    {name: "Name 1", icon: "/api/static/user_icons/sock_puppet_blue.png", game_points: 0},
    {name: "Name 2", icon: "/api/static/user_icons/sock_puppet_green.png", game_points: 1},
    {name: "Name 3", icon: "/api/static/user_icons/sock_puppet_yellow.png", game_points: 5},
    {name: "Name 4", icon: "/api/static/user_icons/sock_puppet_pink.png", game_points: 2},
].sort((a, b) => b.game_points - a.game_points)

</script>

<template>
    <ul class="game-results">
        <li 
            v-for="result, i in (results.length <= 3 ? results : results.slice(0, 3))" 
            :class="`game-results__entry place-${i + 1}`"
        >
            <img :src="result.icon" alt="" class="icon">
            <p class="result">
                <span class="name">{{ result.name }}</span>
                <span class="game-points">{{ result.game_points }}</span>
            </p>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.game-results{
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: end;
    gap: 1.5rem;

    place-self: center;

    width: min(80%, 40rem);

    position: relative;

    &__entry{
        --_bar-height: 10rem;

        display: grid;
        grid-template-rows: min-content var(--_bar-height);
        gap: 1rem;

        .icon{
            width: 6rem;
            height: 6rem;

            border-radius: 100%;

            overflow: hidden;

            justify-self: center;
        }

        .result{
            display: grid;
            align-content: start;
            justify-items: center;

            background-color: white;

            border-radius: 1rem 1rem 0 0;

            padding: 1rem;

            & .game-points{
                font-size: 4rem;
                color: #0008;
            }
        }

        &.place-1{
            --_bar-height: 20rem;
        }

        &.place-2{
            --_bar-height: 15rem;
        }
    }

    &::after{
        content: '';

        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);

        height: 3rem;
        width: 110%;

        border-radius: 3rem;

        background-color: white;
    }
}
</style>