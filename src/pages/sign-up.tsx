import signup from '@/../public/signup.svg';
import { SignupContext } from '@/contexts/singupCtx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useMemo, useRef, useState } from 'react';
import CustomToast from '../components/CustomToast';
import HorizontalNonLinearStepper from '../components/Stepper';
import { StepOne, StepTwo } from '../components/singup';

import { setTimeout } from 'timers';
import CustomBackdrop from '../components/CustomBackdrop';
import { createUser } from '../lib/api/general';
import { validateSignupData } from '../lib/helpers';
import { UseToastContext } from './_app';

// log db url from .env
console.log(process.env.NEXT_PUBLIC_DB_URL);

const signupSteps = [
  {
    title: '',
    component: <StepOne />,
  },
  {
    title: '',
    component: <StepTwo />,
  },
];

const SignUpPage = () => {
  const { openToast } = useContext(UseToastContext);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [firstLastName, setFirstLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const values = useMemo(
    () => ({
      firstName,
      setFirstName,
      firstLastName,
      setFirstLastName,
      secondLastName,
      setSecondLastName,
      email,
      setEmail,
      password,
      setPassword,
      confirmPassword,
      setConfirmPassword,
      phone,
      setPhone,
    }),
    [
      firstName,
      setFirstName,
      firstLastName,
      setFirstLastName,
      secondLastName,
      setSecondLastName,
      email,
      setEmail,
      password,
      setPassword,
      confirmPassword,
      setConfirmPassword,
      phone,
      setPhone,
    ]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (
    //   !firstName ||
    //   !firstLastName ||
    //   !secondLastName ||
    //   !email ||
    //   !password ||
    //   !confirmPassword ||
    //   !phone
    // ) {
    //   return openToast('Por favor llena todos los campos', 'error');
    // }

    // if (password !== confirmPassword) {
    //   return openToast('Las contraseñas no coinciden', 'error');
    // }

    // if (phone.length !== 10) {
    //   return openToast('El número de teléfono debe ser de 10 dígitos', 'error');
    // }

    // const emailRegex = new RegExp(
    //   '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
    // );

    // const emailDomain = email.split('@')[1];

    // if (!emailRegex.test(email) || emailDomain !== 'ceti.mx') {
    //   return openToast('El correo electrónico debe ser válido', 'error');
    // }

    const data = {
      firstName,
      firstLastName,
      secondLastName,
      email,
      password,
      confirmPassword,
      phoneNumber: phone,
    };

    const { isValid, errorMsg } = validateSignupData(data);
    if (!isValid) {
      return openToast(errorMsg, 'error');
    }

    setLoading(true);
    const response = await createUser(data);
    if (response.status === 201) {
      setTimeout(() => {
        // add email to url query params
        router.push(`/login?email=${email}`);
      }, 2000);

      setLoading(false);
      setMessage('Usuario creado correctamente');
      setSeverity('success');
      setOpen(true);
    } else {
      setLoading(false);

      setMessage('Error al crear usuario');
      setSeverity('error');
      setOpen(true);
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-full flex-col md:flex-row-reverse">
      <Image src={signup} alt="car" className="w-1/2 md:h-1/2 md:block" />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className=" p-10 flex items-center justify-center flex-col w-[400px] 
        "
      >
        <h1 className="text-[2rem] font-semibold mb-5">Regístrate</h1>
        <SignupContext.Provider value={values}>
          <HorizontalNonLinearStepper
            steps={signupSteps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            labelOnLastStep="Registrarse"
          />
        </SignupContext.Provider>
        <div>
          <span>¿Ya tienes cuenta? </span>
          <Link href="/login" className="underline">
            Inicia sesión aquí
          </Link>
        </div>
      </form>
      <CustomToast
        open={open}
        message={message}
        severity={severity as 'success' | 'error' | 'info' | 'warning'}
        handleClose={() => setOpen(false)}
      />
      <CustomBackdrop open={loading} />
    </div>
  );
};

export default SignUpPage;
