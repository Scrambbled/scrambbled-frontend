export const supportedGames = ['words_in_words_game'] as const
export type SupportedGame = typeof supportedGames[number]

export interface GameFrontData{
    icon: string,
    gameId: SupportedGame,
    name: string,
}

const gameIdFrontDataMap: {[key in SupportedGame]: GameFrontData} = {
    'words_in_words_game': { icon: '', gameId: 'words_in_words_game', name: "Words in Words"}
}

export const getFrontGameData = (gameId: string) => gameIdFrontDataMap[gameId as SupportedGame] ?? null