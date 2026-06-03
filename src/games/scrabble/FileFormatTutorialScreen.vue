<template>

<main class="framed-box tutorial-screen">
    <p>To use a custom dictionary You must prepare 2 files.</p>
    <p>First one being a <b>text file</b> containing a word list. Each word should be placed in a new line, like so:</p>
    <code data-language="Plain Text">
        word1<br>
        word2<br>
        word3<br>
    </code>
    <p>
        Second file should be a <b>JSON</b> file containing scores for each letter, 
        and number of letters in the letter pouch. Structure should look like this:
    </p>
    <code data-language="json">
        {<br>
        &nbsp;&nbsp;"letterValues": { <br>
        &nbsp;&nbsp;&nbsp;&nbsp;"W": 1, "O": 3, "R": 2, "D": 2,<br>
        &nbsp;&nbsp;&nbsp;&nbsp;"1": 1, "2": 5, "3": 3<br>
        &nbsp;&nbsp;},<br>
        &nbsp;&nbsp;"letterDistribution": {<br>
        &nbsp;&nbsp;&nbsp;"W": 10, "O": 2, "R": 8, "D": 3,<br>
        &nbsp;&nbsp;&nbsp;"1": 4, "2": 4, "3": 4<br>
        &nbsp;&nbsp;}<br>
        }
    </code>
    <p>
        Remember to add all the letters that are present in words.
    </p>
</main>

</template>

<style lang="scss">
#app{
    // background-image: linear-gradient(to bottom right, rgb(234, 187, 99), rgb(234, 99, 140));
}
</style>

<style lang="scss" scoped>

main{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: min(90%, 50rem);

    color: white;
}

p:not(:first-child){
    margin-top: 1rem;
}

code{
    display: grid;
    grid-template-rows: 3rem min-content;

    background-color: #5a396b;
    border: .25rem solid hsl(280, 30%, 22%);

    border-radius: 1rem;

    font-size: 1.2rem;

    color: white;

    &::before{
        content: attr(data-language);

        background-color: hsl(280, 30%, 22%);

        display: grid;
        align-content: center;

        text-transform: capitalize;

        padding-inline-start: 1rem;

        font-size: 1rem;
    }
}

</style>