import car from '@/../public/car.svg';
import { TextField } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CustomButton from '../components/Button';

const LoginPage = () => {
  //   const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // await login(email, password);
  };

  return (
    <div className="w-full flex items-center justify-center h-full flex-col md:flex-row">
      <Image src={car} alt="car" height={200} className="w-1/2 md:block" />
      <form
        onSubmit={handleSubmit}
        className=" p-10 flex items-center justify-center flex-col w-[400px] 
        "
      >
        <h1 className="text-[2rem] font-semibold mb-5">Iniciar Sesión</h1>
        <div className="my-2 w-full">
          <TextField
            label="Correo"
            variant="outlined"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className=" w-full "
            size="small"
          />
        </div>
        <div className="my-2 w-full">
          <TextField
            label="Contraseña"
            variant="outlined"
            className=" w-full "
            size="small"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {/* no tienes cuenta? */}

        <div>
          <span>¿No tienes cuenta? </span>
          <Link href="/sing-up" className="underline">
            Registrate aquí
          </Link>
        </div>

        <div className="mt-5 w-full">
          <CustomButton variant="primary">Iniciar sesión</CustomButton>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
