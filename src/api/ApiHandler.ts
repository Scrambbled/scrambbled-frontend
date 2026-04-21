import type { GameTemplateData, Listener, SessionAccessCode } from "../common_types"
import type { UserIcon } from "../types/user_types"

// const API = `${import.meta.env.VITE_API}`
const API = `/api`

const getProfileIcons = () => fetch(`${API}/user/icon/all`)
const getAllGames = () => fetch(`${API}/game/all`)

const createGameSession = (gameId: string) => fetch(`${API}/session/create`, {
    method: 'POST',
    body: JSON.stringify({gameId}),
    headers: {
        'Content-Type': 'application/json'
    }
})

const icons: Map<string, UserIcon> = new Map()

export const useApiHandler = () => ({
    getProfileIcons: (callback: (icons: UserIcon[]) => any) => getProfileIcons()
        .then(d => d.json())
        .then(icons => callback((icons as UserIcon[]).map(icon => ({...icon, path: `${API}/${icon.path}`}))))
        .catch(console.error),

    getAllGames: (callback: Listener<GameTemplateData[]>) => getAllGames()
        .then(d => d.json())
        .then(games => callback(games as GameTemplateData[]))
        .catch(console.error),

    createGameSession: (gameId: string, callback: Listener<SessionAccessCode>) => createGameSession(gameId)
        .then(d => d.text())
        .then(accessCode => callback(accessCode))
        .catch(console.error),

    getUserIcon: (iconName: string, callback: Listener<UserIcon | null>) => {
        if(icons.size === 0){
            getProfileIcons()
                .then(d => d.json())
                .then(_icons => (_icons as UserIcon[]).forEach(icon => icons.set(icon.name, icon)))
                .catch(console.error)

            console.log('Loaded icons')
        }

        callback(icons.get(iconName) ?? null)
    }
})