import { TextField } from '@mui/material';
import { useRouter } from 'next/router';
import CustomButton from '../../components/Button';
import GoBackHeader from '../../components/GoBackHeader';
import MainLayout from '../../layouts/MainLayout';

const SearchTripPage = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <GoBackHeader onClick={() => router.push('/passenger')} />
        <h1 className="text-[2rem]  text-cxBlue font-semibold ">
          Buscar viaje
        </h1>
        <div className="mt-4">
          <TextField
            id="outlined-basic"
            label="Origen"
            variant="outlined"
            fullWidth
            size="small"
          />
        </div>
        <div className="mt-4">
          <TextField
            id="outlined-basic"
            label="Destino"
            variant="outlined"
            fullWidth
            size="small"
          />
        </div>
        <div className="mt-4">
          <TextField
            id="outlined-basic"
            label="Fecha"
            variant="outlined"
            fullWidth
            size="small"
          />
        </div>

        <div className="mt-4">
          <TextField
            id="outlined-basic"
            label="Hora"
            variant="outlined"
            fullWidth
            size="small"
          />
        </div>

        {/* checkbox to ask if it is recurrent */}
        <div className="mt-4">
          <div className="flex flex-row items-center justify-start w-full">
            <span className="text-gray-500 ml-2">¿Es recurrente?</span>
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-200 rounded-md ml-2"
            />
          </div>
        </div>

        <div className="mt-8">
          <CustomButton variant="primary">Buscar</CustomButton>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchTripPage;
