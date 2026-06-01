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

export interface Letter{
    letter: string,
    points: number,
}

export interface MoveAckResponse{
    status: 'accepted' | 'invalid_placement' | 'must_contain_starting_square' | 'bad' | 'error',
    points: number,
    updatedScores: Record<string, number>,
    newTray: Letter[],
    letterInPouch: number,
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
}

export type SupportedConfigLanguages = 'en' | 'pl' | 'custom'

export interface ConfigureGamePayload{
    language: SupportedConfigLanguages,
    gameLengthMultiplier: number,
}

export interface GameConfigAck{
    status: 'error' | 'ok',
    message: string,
    language?: string,
    gameLengthMultiplier: number,
}

export interface HostAssignedDTO{
    isHost: boolean,
}

export interface TurnStartPayload{
    activePlayerId: string,
    lettersInPouch: number,
    scores: Record<string, number>,
    board: BoardTileState,
    lastRound: boolean,
    lastRoundTurnsLeft?: number,
}

export interface PlayerJoinedPayload{
    player: PlayerInfoDTO,
    // Observer, player
    role: string,
    // Id of a game host
    hostId: string,
}

export interface RoomStatePayload{
    members: {player: PlayerInfoDTO, role: string}[],
    hostId: string,
    gameName: string,
    gameId: string,
}

export interface BoardTile{
    letter: string,
    points: number,
    x: number,
    y: number,
}

export type BoardTileState = BoardTile[]

export interface GameOverPayload{
    winner: string,
    finalScores: Record<string, number>,
}

export interface PassAckResponse{
    status: 'ok' | 'error',
    message?: string,
}