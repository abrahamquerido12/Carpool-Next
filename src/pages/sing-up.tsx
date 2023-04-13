import signup from '@/../public/signup.svg';
import { SignupContext } from '@/contexts/singupCtx';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import HorizontalNonLinearStepper from '../components/Stepper';
import { StepOne, StepTwo } from '../components/singup';

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
    // await login(email, password);
  };

  return (
    <div className="w-full flex items-center justify-center h-full flex-col md:flex-row-reverse">
      <Image src={signup} alt="car" className="w-1/2 md:h-1/2 md:block" />

      <form
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
            actionOnFinish={() => console.log('finish')}
            labelOnLastStep="Registrarse"
          />
        </SignupContext.Provider>
        <div>
          <span>¿Ya tienes cuenta? </span>
          <Link href="/login" className="underline">
            Inicia sesión aquí
          </Link>
        </div>

        {/* <div className="mt-5 w-full">
          <CustomButton variant="primary">Iniciar sesión</CustomButton>
        </div> */}
      </form>
    </div>
  );
};

export default SignUpPage;
