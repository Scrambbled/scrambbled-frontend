export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max + min) - min)

export const randomPick = (array: any[]) => array[randInt(0, array.length)]

export type FnMap<T, R> = {
    [key: string]: (data: T) => R
}