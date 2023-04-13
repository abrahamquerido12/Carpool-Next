import { Dispatch, SetStateAction, createContext } from 'react';

export interface SignupContextProps {
  firstName: string;
  firstLastName: string;
  secondLastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;

  setFirstName: Dispatch<SetStateAction<string>>;
  setFirstLastName: Dispatch<SetStateAction<string>>;
  setSecondLastName: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  setPhone: Dispatch<SetStateAction<string>>;
}

export const SignupContext = createContext<SignupContextProps>({
  firstName: '',
  firstLastName: '',
  secondLastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',

  setFirstName: () => {},
  setFirstLastName: () => {},
  setSecondLastName: () => {},
  setEmail: () => {},
  setPassword: () => {},
  setConfirmPassword: () => {},
  setPhone: () => {},
});
