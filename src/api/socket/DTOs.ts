export interface UserData{
    userId: string, 
    accessCode: string, 
    nickname: string, 
    icon: string,
}

export interface AllPlayersPayload{
    players: UserData[],
}