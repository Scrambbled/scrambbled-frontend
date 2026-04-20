<script setup lang="ts">

const results = [
    {name: "Name 1", icon: "/api/static/user_icons/sock_puppet_blue.png", game_points: 0, round_points: 17},
    {name: "Name 2", icon: "/api/static/user_icons/sock_puppet_green.png", game_points: 1, round_points: 17},
    {name: "Name 3", icon: "/api/static/user_icons/sock_puppet_yellow.png", game_points: 0, round_points: 18},
    {name: "Name 4", icon: "/api/static/user_icons/sock_puppet_pink.png", game_points: 2, round_points: 17},
].sort((a, b) => (b.round_points) - (a.round_points))

</script>

<template>
    <ul class="round-results">
        <li v-for="result in results" class="round-results__entry">
            <img :src="result.icon" class="icon" alt="">
            <p class="name">{{ result.name }}</p>
            <p class="points">
                <span class="round-points">{{ result.round_points }}</span>
                /
                <span class="game-points">{{ result.game_points }}</span>
            </p>
        </li>
    </ul>
</template>

<style lang="scss" scoped>

.round-results{
    display: grid;
    gap: .5rem;
    align-content: center;

    width: min(80%, 40rem);

    &__entry{
        --_icon-size: 5rem;

        display: grid;
        grid-template-columns: min-content auto min-content;
        justify-items: center;
        align-items: center;

        background-color: #fff;

        border-radius: var(--_icon-size);

        padding-inline: .25rem 1rem;
        padding-block: .25rem;

        border-bottom: .25rem solid #0002;

        & .icon{
            width: var(--_icon-size);
            height: var(--_icon-size);

            border-radius: 100%;
        }

        & .name{
            font-size: 2rem;
        }

        & .points{
            display: flex;
            align-items: center;
            gap: .25rem;

            & .game-points{
                font-size: 1.5rem;
                color: #0008
            }

            & .round-points{
                font-size: 2rem;

            }
        }
    }
}

</style>