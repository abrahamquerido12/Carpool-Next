import axios from 'axios';
import { CarDto } from './driverTypes';

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
