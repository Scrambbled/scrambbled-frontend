<script setup lang="ts"></script>

<template>

<h2 class="message waiting-spinner framed-box">Waiting for the game to start</h2>

</template>

<style lang="scss">
@property --turn-end{
    syntax: "<angle>";
    inherits: true;
    initial-value: 0deg;
}

@property --turn-start{
    syntax: "<angle>";
    inherits: true;
    initial-value: 0deg;
}
</style>

<style lang="scss" scoped>
.message{
    font-size: min(3.5rem, max(2rem, calc(100vw / 18)));

    color: white;
    // text-shadow: 0 0 .2rem #0007;

    display: grid;
    justify-items: center;
    gap: 2rem;

    align-self: center;

    // Offset so it looks more centered
    margin-bottom: 10rem;
}

.waiting-dots::after{
    content: '';
    animation: waiting-dots 3s linear infinite forwards;
}

@keyframes waiting-dots {
    0%{
        content: '.'
    }

    32%{
        content: '.'
    }

    33%{
        content: '..'
    }

    65%{
        content: '..'
    }

    66%{
        content: '...'
    }

    100%{
        content: '...'
    }
}

.waiting-spinner::after{
    content: '';

    display: inline-block;

    width: 4rem;
    height: 4rem;

    border-radius: 50%;

    background-image: conic-gradient(
        at 50% 50%,
        transparent calc(var(--turn-start) - 1deg),
        white var(--turn-start),
        white var(--turn-end),
        transparent calc(var(--turn-end) + 1deg)
    );

    animation: spinning-conic-gradient 3s ease-in-out forwards infinite;
}

@keyframes spinning-conic-gradient {
    0% {
        --turn-end: 0deg;
    }
    50%{
        --turn-end: 360deg;
        --turn-start: 0deg;
    }
    100%{
        --turn-end: 360deg;
        --turn-start: 360deg;
    }
}
</style>