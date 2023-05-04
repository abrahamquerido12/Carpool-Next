export interface CreateTripReqPayload {
  date: string;
  isRecurrent: boolean;
  weeklyTripId: string;

  distanceToOrigin: number;
  distanceToDestination: number;
  searchedDateTime: string;
  searchedDestination: string;
  searchedDestinationCoordinates: string;
  searchedOrigin: string;
  searchedOriginCoordinates: string;
}

export interface SearchTripDto {
  date: string;
  origin: string;
  originCoordinates: string;
  destination: string;
  destinationCoordinates: string;
  departureTime: string;
}
