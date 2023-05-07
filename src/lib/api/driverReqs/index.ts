import axios from 'axios';
import { AddWeeklyTripDto, CarDto, UpdateTripRequestDto } from './driverTypes';

export const getCarData = async () => {
  const { data } = await axios.get('/api/driver/car');
  return data;
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
