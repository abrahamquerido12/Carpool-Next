import car from '@/../public/car.svg';
import { TextField } from '@mui/material';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CustomButton from '../components/Button';
import CustomToast from '../components/CustomToast';

const LoginPage = () => {
  const router = useRouter();

  //get message from query
  const error = router.query.error?.toString();

  //   const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('submit');

    await signIn('credentials', {
      callbackUrl: router.query.callbackUrl?.toString() || '/',
      email,
      password,
    });
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
            type="password"
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
          <CustomButton variant="primary" type="submit">
            Iniciar sesión
          </CustomButton>
        </div>
      </form>

      <CustomToast
        open={!!error}
        message={error || ''}
        severity="error"
        handleClose={() => router.push('/login')}
      />
    </div>
  );
};

export default LoginPage;
