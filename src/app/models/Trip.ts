export interface Trip {
    id?: number,
    reason: string,
    description: string,
    fromCountry: string,
    toCountry: string,
    departureDate: Date,
    arrivalDate: Date,
    status?: string,
    photo?: string | null
}