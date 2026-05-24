import type { LetterTileData } from "./data_type";

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

export interface PlayerInfoDTO{
    id: string,
    nickname: string,
    iconUrl: string,
}

export interface ScrabbleStartedPayload{
    boardData: BoardData,
    players: PlayerInfoDTO[],
}

export interface CheckWordPayload{
    placedTiles: PlacedTileLetterOnly[],
}

export interface PlacedTileLetterOnly{
    letter: string,
    x: number,
    y: number,
}

export interface PlacedTile{
    tile: LetterTileData,
    x: number,
    y: number,
}

export interface CheckWordResponse{
    /// 'bad' means word creates other incorrect words
    status: 'invalid_placement' | 'must_contain_starting_square' | 'good' | 'bad',
    points: number | null,
}

export interface TrayUpdateDTO{
    tray: LetterTileData[],
}

export interface PlayerAndPoints{
    player: PlayerInfoDTO,
    points: number,
    isHost: boolean,
}

export interface ConfigureGamePayload{
    language: string,
    gameLengthMultiplier: number,
}