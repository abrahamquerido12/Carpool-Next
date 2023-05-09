import axios from 'axios';
import useSWR from 'swr';
import { fetcher } from '../Swr';
import {
  AddWeeklyTripDto,
  CarDto,
  RemovePassengerFromTripDto,
  UpdateTripRequestDto,
} from './driverTypes';

export const useTripDeatils = (id: number) => {
  const { data, error, mutate } = useSWR(`/api/trips/${id}`, fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export const useWeeklyTrips = () => {
  const { data, error, mutate } = useSWR('/api/driver/weeklytrip', fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export const useDriverData = () => {
  const { data, error } = useSWR('/api/driver', fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
  };
};

export const useUpcomingTrips = () => {
  const { data, error, mutate } = useSWR('/api/driver/trips/upcoming', fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export const useTripRequests = () => {
  const { data, error, mutate } = useSWR('/api/driver/trip-requests', fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export const useTripRequest = (id: number) => {
  const { data, error, mutate } = useSWR(
    `/api/driver/trip-requests/${id}`,
    fetcher
  );

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export const useCarData = () => {
  const { data, error } = useSWR('/api/driver/car', fetcher);
  return {
    data,
    error,

    isLoading: !data && !error,
  };
};

export const saveCarData = async (data: CarDto) => {
  return await axios.post('/api/driver/car', data);
};

export const getWeeklyTrips = async () => {
  const { data } = await axios.get('/api/driver/weeklyTrips');
  return data;
};

export const deleteTrip = async (id: number) => {
  return await axios.delete(`/api/driver/weeklytrip/${id}`);
};

export const addWeeklyTrip = async (payload: AddWeeklyTripDto) => {
  return axios.post('/api/driver/weeklytrip', payload);
};

export const updateTripRequest = async (
  id: number,
  payload: UpdateTripRequestDto
) => {
  return axios.put(`/api/driver/trip-requests/${id}`, payload);
};

export const cancelTrip = async (id: number) => {
  return axios.put(`/api/trips/${id}`);
};

export const deleteRemovePassengerFromTrip = async (
  id: number,
  body: RemovePassengerFromTripDto
) => {
  return axios.put(`/api/driver/trips/${id}/remove-passenger`, body);
};
