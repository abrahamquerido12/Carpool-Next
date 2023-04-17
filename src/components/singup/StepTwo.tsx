import { TextField } from '@mui/material';
import { useContext } from 'react';
import { SignupContext } from '../../contexts/singupCtx';

const StepTwo = () => {
  const {
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,

    email,
    setEmail,
  } = useContext(SignupContext);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full pt-5">
      <div className="w-full my-2">
        <TextField
          label="Teléfono"
          variant="outlined"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full"
          size="small"
        />
      </div>

      <div className="w-full my-2">
        <TextField
          label="Correo"
          variant="outlined"
          value={email}
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          size="small"
        />
      </div>

      <div className="w-full my-2">
        <TextField
          label="Contraseña"
          variant="outlined"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          size="small"
          type="password"
        />
      </div>

      <div className="w-full my-2">
        <TextField
          label="Confirmar contraseña"
          variant="outlined"
          name="confirm_password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full"
          size="small"
          type="password"
        />
      </div>
    </div>
  );
};

export default StepTwo;
