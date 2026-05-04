import { ref } from "vue";
import type { LetterTileData } from "./data_type";
import type { BoardData } from "./DTOs";

export const getDefaultScrabbleState = () => ({
    letterPouch: ref<LetterTileData[]>([]),
    letterTray: ref<LetterTileData[]>([]),
    boardData: ref<BoardData | null>(null),

    floatingLetter: ref<LetterTileData>({letter: '-', points: 0}),
    isLetterFloating: ref(false),
    floatingLetterPos: ref({x: 0, y: 0}),
})

// Extract type from getDefaultScrabbleState return value
export type ScrabbleState = ReturnType<typeof getDefaultScrabbleState>