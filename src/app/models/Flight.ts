export interface Flight {
    id?: number,
    fromCity: string,
    toCity: string,
    departureDate: Date,
    arrivalDate: Date,
    boardingTime: Date,
    price: number,
    flightClass: string
}