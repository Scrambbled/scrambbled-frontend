import { ref, type Ref } from "vue";
import type { LetterTileData } from "./data_type";
import type { BoardData, PlayerAndPoints, PlayerInfoDTO } from "./DTOs";

export const gamePhases = ['setup', 'round', 'round', 'scores'] as const
export type GamePhase = typeof gamePhases[number]

export const getDefaultScrabbleState = () => ({
    pouchLetterCount: ref<number>(0),
    letterTray: ref<LetterTileData[]>([]),
    boardData: ref<BoardData | null>(null),
    stopBoardMoving: ref(false),

    floatingLetter: ref<LetterTileData>({letter: '-', points: 0}),
    isLetterFloating: ref(false),
    floatingLetterPos: ref({x: 0, y: 0}),
    floatingLetterSource: ref<'board' | 'tray'>('tray'),
    onFloatingLetterCancel: () => {},

    playersAndPoints: ref<PlayerAndPoints[]>([]),

    gamePhase: ref<GamePhase>('setup'),

    points: ref(0),

    isPlayersRound: ref(false),

    host: ref<PlayerInfoDTO | null>(null),

    lettersReturned: ref<LetterTileData[]>([]),
})

export function resetGameState(state: ScrabbleState){
    const newState = getDefaultScrabbleState()

    Object.entries(newState).forEach(([key, val]) => {
        // Quick and dirty fix
        if(key !== 'playersAndPoints' && key !== 'host'){
            (state[key as keyof ScrabbleState] as Ref).value = (val as Ref).value
        }
    })
}

// Extract type from getDefaultScrabbleState return value
export type ScrabbleState = ReturnType<typeof getDefaultScrabbleState>