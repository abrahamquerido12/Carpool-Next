import axios from 'axios';
import { CarDto } from './driverTypes';

export const getCarData = async () => {
  const { data } = await axios.get('/api/driver/car');
  return data;
};

export const saveCarData = async (data: CarDto) => {
  return await axios.post('/api/driver/car', data);
};
