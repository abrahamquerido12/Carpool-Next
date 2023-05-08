import axios from 'axios';
import useSWR from 'swr';

import { fetcher } from '../Swr';
import { CreateTripReqPayload, SearchTripDto } from './passengerTypes';

export const createTripRequest = async (payload: CreateTripReqPayload) => {
  return axios.post('/api/trips/trip-requests', payload);
};

export const searchTrips = async (data: SearchTripDto) => {
  return axios.post('/api/trips/search', data);
};

export const useUpcomingTrips = () => {
  const { data, error, mutate } = useSWR(
    '/api/passenger/trips/upcoming',
    fetcher
  );

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export const useTripRequests = () => {
  const { data, error, mutate } = useSWR(
    '/api/passenger/trips/trip-requests',
    fetcher
  );

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export const useTripDeatils = (id: number) => {
  const { data, error } = useSWR(`/api/passenger/trips/${id}`, fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
  };
};

export const cancelTrip = async (id: number) => {
  return axios.delete(`/api/passenger/trips/${id}/cancel-trip`);
};
