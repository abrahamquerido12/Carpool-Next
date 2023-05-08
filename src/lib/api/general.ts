import axios from 'axios';
import useSWR from 'swr';
import { fetcher } from './Swr';
import { CreateUserDto } from './generalTypes';

export const createUser = (data: CreateUserDto) => {
  return axios.post('/api/user', data);
};

export const resendVerificationEmail = () => {
  return axios.post('/api/user/resend-verification-email');
};

export const useUserData = () => {
  const { data, error } = useSWR('/api/user', fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
  };
};
