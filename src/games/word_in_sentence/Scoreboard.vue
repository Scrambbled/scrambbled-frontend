<script setup lang="ts">

const player_scores = [
    {name: "Name 1", icon: "/api/static/user_icons/sock_puppet_blue.png", game_points: 0, round_points: 17},
    {name: "Name 2", icon: "/api/static/user_icons/sock_puppet_green.png", game_points: 1, round_points: 17},
    {name: "Name 3", icon: "/api/static/user_icons/sock_puppet_yellow.png", game_points: 0, round_points: 18},
    {name: "Name 4", icon: "/api/static/user_icons/sock_puppet_pink.png", game_points: 2, round_points: 17},
].sort((a, b) => (b.game_points * 10000 + b.game_points) - (a.game_points * 10000 + a.round_points))

</script>

<template>
    <ul class="user-list">
        <li v-for="player in player_scores" class="user">
            <img class="icon" :src="player.icon" alt="">
            <p class="name">{{ player.name }}</p>
            <p class="points">
                <span class="round-points">{{ player.round_points }}</span>
                /
                <span class="game-points">{{ player.game_points }}</span>
            </p>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.user-list{
    --_icon-size: 3rem;

    list-style-type: none;

    display: grid;
    gap: .5rem;

    & .user{
        display: grid;
        align-items: center;
        grid-template-columns: var(--_icon-size) min-content min-content;
        gap: 1rem;

        padding-inline: .25rem 1rem;
        padding-block: .25rem;

        background-color: white;

        border-radius: var(--_icon-size) 0 0 var(--_icon-size);

        & .icon{
            width: var(--_icon-size);
            height: var(--_icon-size);

            border-radius: 100%;
            overflow: hidden;
        }

        & .name, .points{
            text-wrap: nowrap;
        }

        & .name{
            padding-inline-end: 1rem;
        }
    }
}
</style>