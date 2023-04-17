import { useSession } from 'next-auth/react';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface UserContextProps {
  id: number | null;
  email: string;
  isDriver: boolean | null;
  driverId?: number | null;
  firstName?: string;
  firstLastName?: string;
  secondLastName?: string;
  phone?: string;
  passengerId?: number | null;

  loading: boolean;

  setId: Dispatch<SetStateAction<number | null>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setIsDriver: Dispatch<SetStateAction<boolean | null>>;
  setDriverId: Dispatch<SetStateAction<number | null>>;
  setFirstName: Dispatch<SetStateAction<string>>;
  setFirstLastName: Dispatch<SetStateAction<string>>;
  setSecondLastName: Dispatch<SetStateAction<string>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setPassengerId: Dispatch<SetStateAction<number | null>>;
}

export const UserContext = createContext<UserContextProps>({
  id: null,
  email: '',
  isDriver: null,
  driverId: null,
  firstName: '',
  firstLastName: '',
  secondLastName: '',
  phone: '',
  passengerId: null,
  loading: false,
  setId: () => {},
  setEmail: () => {},
  setIsDriver: () => {},
  setDriverId: () => {},
  setFirstName: () => {},
  setFirstLastName: () => {},
  setSecondLastName: () => {},
  setPhone: () => {},
  setPassengerId: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [loading, setLoading] = useState(true);

  const [id, setId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [isDriver, setIsDriver] = useState<boolean | null>(null);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [firstName, setFirstName] = useState('');
  const [firstLastName, setFirstLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [passengerId, setPassengerId] = useState<number | null>(null);

  const values = useMemo(
    () => ({
      id,
      setId,
      email,
      setEmail,
      isDriver,
      setIsDriver,
      driverId,
      setDriverId,
      firstName,
      setFirstName,
      firstLastName,
      setFirstLastName,
      secondLastName,
      setSecondLastName,
      phone,
      setPhone,
      passengerId,
      setPassengerId,
      loading,
    }),
    [
      id,
      setId,
      email,
      setEmail,
      isDriver,
      setIsDriver,
      driverId,
      setDriverId,
      firstName,
      setFirstName,
      firstLastName,
      setFirstLastName,
      secondLastName,
      setSecondLastName,
      phone,
      setPhone,
      passengerId,
      setPassengerId,
      loading,
    ]
  );

  const getUserData = async () => {
    if (!session || session.status !== 'authenticated') return;

    const res = await fetch('/api/user');
    const data = await res.json();

    if (data) {
      setId(data.id);
      setEmail(data.email);
      setIsDriver(data.isDriver);
      setDriverId(data.driver?.id || '');
      setFirstName(data.profile?.firstName || '');
      setFirstLastName(data.profile?.firstLastName || '');
      setSecondLastName(data.profile?.secondLastName || '');
      setPhone(data.profile?.phone || '');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!id) {
      getUserData();
    }
  }, [id, session]);

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserProvider;
