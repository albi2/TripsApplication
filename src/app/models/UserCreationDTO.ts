export interface UserCreationDTO{
    username: string,
    email: string,
    password: string,
    roles?: string[]
}