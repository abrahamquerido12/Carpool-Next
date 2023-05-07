import axios from 'axios';
import { CreateUserDto } from './generalTypes';

export const createUser = (data: CreateUserDto) => {
  return axios.post('/api/user', data);
};

export const resendVerificationEmail = () => {
  return axios.post('/api/user/resend-verification-email');
};
