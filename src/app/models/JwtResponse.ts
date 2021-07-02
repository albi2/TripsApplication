
export interface JwtResponse {
    accessToken: string,
    type: string,
    refreshToken: string,
    id: number,
    username: string,
    email: string,
    roles: string[]
}