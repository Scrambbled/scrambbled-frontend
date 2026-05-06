export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max + min) - min)

export const randomPick = (array: any[]) => array[randInt(0, array.length)]

export const isDebugEnv = () => import.meta.env.VITE_DEBUG === 'true'