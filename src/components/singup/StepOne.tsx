import { TextField } from '@mui/material';
import { useContext } from 'react';
import { SignupContext } from '../../contexts/singupCtx';

const StepOne = () => {
  const {
    firstName,
    firstLastName,
    secondLastName,
    setFirstName,
    setFirstLastName,
    setSecondLastName,
  } = useContext(SignupContext);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full pt-5">
      <div className="w-full my-2">
        <TextField
          label="Nombre"
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full"
          size="small"
        />
      </div>

      <div className="w-full my-2">
        <TextField
          label="Apellido Paterno"
          variant="outlined"
          value={firstLastName}
          onChange={(e) => setFirstLastName(e.target.value)}
          className="w-full"
          size="small"
        />
      </div>

      <div className="w-full my-2">
        <TextField
          label="Apellido Materno"
          variant="outlined"
          value={secondLastName}
          onChange={(e) => setSecondLastName(e.target.value)}
          className="w-full"
          size="small"
        />
      </div>
    </div>
  );
};

export default StepOne;
