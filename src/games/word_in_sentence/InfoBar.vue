<script setup lang="ts">

const {
    currentRound,
    totalRounds,
    roundPoints,
    gamePoints,
    socketConnected,
    caption,
} = defineProps<{
    currentRound: number,
    totalRounds: number,

    roundPoints: number,
    gamePoints: number,

    socketConnected: boolean,
    caption: string,
}>()

</script>

<template>
    <header class="game-info framed-box">
        <p class="round">
            <span class="current-round">{{ currentRound }}</span>
            /
            <span class="total-r/socket-connected.svgounds">{{ totalRounds }}</span>
        </p>

        <div class="connection-status">
            <img v-if="socketConnected" src="/img/socket_connected.svg" alt="connected">
            <img v-else src="/img/socket_disconnected.svg" alt="disconnected">
        </div>

        <p class="caption">{{ caption }}</p>

        <section class="all-points">
            <p class="labeled-points">
                <span class="label">Game</span>
                <span class="points">{{ gamePoints }}</span>
            </p>
            <p class="labeled-points">
                <span class="label">Round</span>
                <span class="points">{{ roundPoints }}</span>
            </p>
        </section>
    </header>
</template>

<style lang="scss" scoped>
.game-info{
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    color: white;

    display: grid;
    grid-template-columns: min-content min-content auto min-content;
    align-items: center;
    gap: 2rem;

    padding-block: .25rem;

    width: 90%;

    & .caption{
        text-align: center;

        font-size: 2rem;
    }

    & .round{
        font-size: 2rem;

        display: flex;
        align-items: center;

        gap: .25rem;

        color: #fffc;

        & .current-round{
            font-size: 3rem;

            font-weight: bold;
            color: white;
        }
    }

    & .connection-status{
        width: 6rem;
        height: 100%;

        display: grid;
        place-content: center;

        & > img{
            object-fit: contain;
        }
    }

    & .all-points{
        display: flex;
        gap: 1rem;

        & .labeled-points{
            display: grid;
            justify-items: center;

            & .label{
                text-transform: uppercase;

                background-color: white;

                mix-blend-mode: screen;
                color: black;

                font-weight: bold;

                border-radius: .5rem .5rem 0 0;
                padding: .15rem .5rem;
            }

            & .points{
                border: .2rem solid white;

                width: 100%;

                border-radius: 0 0 .5rem .5rem;

                text-align: center;
            }
        }
    }
}
</style>