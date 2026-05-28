import type { PlayerInfoDTO } from "../../games/scrabble/DTOs";

export interface UserData{
    userId: string, 
    accessCode: string, 
    nickname: string, 
    icon: string,
}

export interface AllPlayersPayload{
    players: UserData[],
}

export interface FileUploadData{
    filename: string,
    data: ArrayBuffer,
}

export interface HostUpgradeDTO{
    host: PlayerInfoDTO,
}