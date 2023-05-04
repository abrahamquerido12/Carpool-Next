import axios from 'axios';
import { CreateTripReqPayload, SearchTripDto } from './passengerTypes';

export const createTripRequest = async (payload: CreateTripReqPayload) => {
  return axios.post('/api/trips/trip-requests', payload);
};

export const searchTrips = async (data: SearchTripDto) => {
  return axios.post('/api/trips/search', data);
};
