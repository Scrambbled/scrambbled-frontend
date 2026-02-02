import type { UserIcon } from "../types/user_types"
import type { GameDTO } from "./dtos/game"

const API = `${import.meta.env.VITE_API}`

const getProfileIcons = () => fetch(`${API}/user/icon/all`)
const getAllGames = () => fetch(`${API}/game/all`)

const createSession = (gameId: string) => fetch(`${API}/session/create`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        gameId: gameId
    })
})

export const useApiHandler = () => ({
    getProfileIcons: (callback: (icons: UserIcon[]) => any) => getProfileIcons()
        .then(d => d.json())
        .then(icons => callback((icons as UserIcon[]).map(icon => ({...icon, path: `${API}/${icon.path}`})))).catch(console.error),

    getAllGames: (callback: (games: GameDTO[]) => any) => getAllGames()
        .then(d => d.json())
        .then(games => callback(games as GameDTO[]))
        .catch(console.error),

    createSession: (gameId: string, callback: (accessCode: string) => any) => createSession(gameId)
        .then(d => d.text())
        .then(accessCode => callback(accessCode))
        .catch(console.error)
})