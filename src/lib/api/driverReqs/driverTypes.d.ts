export interface CarDto {
  model: string;
  brand: string;
  color: string;
  seats: number;
  plate: string;
}

export interface AddWeeklyTripDto {
  origin: string;
  originCoordinates: string;
  destination: string;
  destinationCoordinates: string;
  departureTime: string;
  dayOfWeek: string;
}

export interface UpdateTripRequestDto {
  acceptTrip: boolean;
}

export interface RemovePassengerFromTripDto {
  passengerId: string;
}
