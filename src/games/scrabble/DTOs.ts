export interface BoardData{
    width: number,
    height: number,
    startingSquare: {
        x: number,
        y: number,
    }
    specialSquares: SpecialSquare[],
}

export interface SpecialSquare{
    wordMultiplier: number,
    letterMultiplier: number,
    x: number,
    y: number,
}

