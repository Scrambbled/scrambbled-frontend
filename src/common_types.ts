export type Listener<Data> = (data: Data) => any

export interface GameTemplateData{
    gameId: string,
}

export type SessionAccessCode = string