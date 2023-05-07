import car from '@/../public/car.svg';
import { TextField } from '@mui/material';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import CustomButton from '../components/Button';
import CustomBackdrop from '../components/CustomBackdrop';
import CustomToast from '../components/CustomToast';
import { UseToastContext } from './_app';

const LoginPage = () => {
  const { openToast } = useContext(UseToastContext);
  const router = useRouter();

  //get message from query
  const error = router.query.error?.toString();
  const emailFromQuery = router.query.email?.toString();
  const verified = router.query.verified?.toString();
  //   const { user, login } = useAuth();
  const [email, setEmail] = useState(emailFromQuery || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    await signIn('credentials', {
      callbackUrl: router.query.callbackUrl?.toString() || '/',
      email,
      password,
    });
  };

  useEffect(() => {
    if (verified) {
      openToast('Correo verificado correctamente', 'success');
    }
  }, [verified]);

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
            name="email"
            type="email"
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
            name="password"
            type="password"
            size="small"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {/* no tienes cuenta? */}

        <div>
          <span>¿No tienes cuenta? </span>
          <Link href="/sign-up" className="underline">
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
      <CustomBackdrop open={loading} />
    </div>
  );
};

export default LoginPage;
