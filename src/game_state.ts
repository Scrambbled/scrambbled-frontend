import { ref, watch } from "vue"
import type { SupportedGame } from "./handle_game"
import type { UserProfileData } from "./types/user_types"
import type { UserData } from "./api/socket/DTOs"
import type { SessionAccessCode } from "./common_types"

let _gameId: SupportedGame | null = null

let userProfile: UserProfileData = {
    iconName: 'blue_sock_puppet',
    username: '<name_not_given>',
}

const host = ref<UserData | null>(null)

let _userId: string | null = null

const isHost = ref(false)
watch(host, () => {
    isHost.value = host.value?.userId === _userId
})

let _accessCode: SessionAccessCode = ''

const players = ref<UserData[]>([])

export const useGameState = () => ({
    setGameId: (gameId: SupportedGame) => _gameId = gameId,
    getGameId: () => _gameId,

    setUserProfileData: (data: UserProfileData) => userProfile = data,
    getUserProfileData: () => userProfile,

    isHost,
    host,

    setUserId: (userId: string) => _userId = userId,

    setAccessCode: (accessCode: SessionAccessCode) => _accessCode = accessCode,
    getAccessCode: () => _accessCode,

    players,
})