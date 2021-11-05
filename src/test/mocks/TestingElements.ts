import { Trip } from 'src/app/models/Trip';
import { User } from 'src/app/models/User';
import { UserCreationDTO } from 'src/app/models/UserCreationDTO';
import { Flight } from '../../app/models/Flight';

export class TestingElements {
  static readonly STATUS_APRROVED: string = "APPROVED";
  static readonly STATUS_WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL";
  static readonly ERROR_MESSAGE_TRIP = "Trip with given id could not be found!"

  static readonly TRIP: Trip = {
    id: 1,
    reason: "EVENT",
    description: "Work Event",
    fromCountry: "Albania",
    toCountry: "Nigeria",
    departureDate: new Date(Date.now()),
    arrivalDate: new Date(Date.now()),
    status: "CREATED"
  };

  static readonly USER: User = {
    id: 1,
    username: 'albi',
    email: 'albitaulla@yahoo.com',
    roles: ['ROLE_USER']
  };

  static readonly ADMIN: User = {
    id: 1,
    username: 'albi',
    email: 'albitaulla@yahoo.com',
    roles: ['ROLE_ADMIN']
  };

  static readonly USER_CREATE: UserCreationDTO = {
    username: 'albi',
    email: 'albitaulla@yahoo.com',
    password: 'frenkli1',
    roles: ['ROLE_ADMIN']
  }

  static readonly FLIGHT: Flight = {
    id: 1,
    fromCity: "Tirana",
    toCity: "Miami",
    departureDate: new Date(Date.now()),
    arrivalDate: new Date(+Date.now() + 3600000),
    boardingTime: new Date(+Date.now() - 86000),
    flightClass: "FIRST",
    price: 345.23
  };



}