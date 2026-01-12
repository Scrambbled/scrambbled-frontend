const API = `${import.meta.env.VITE_API}`

const getProfileIcons = () => fetch(`${API}/user/icon/all`)

export const useApiHandler = () => ({
    getProfileIcons: (callback: (icons: UserIcon[]) => any) => getProfileIcons()
        .then(d => d.json())
        .then(icons => callback((icons as UserIcon[]).map(icon => ({...icon, path: `${API}/${icon.path}`})))).catch(console.error)
})

export interface UserIcon{
    name: string,
    path: string,
}