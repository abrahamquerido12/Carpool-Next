import MainLayout from '@/layouts/MainLayout';
import cars from '@/lib/cars.json';
import { AlertColor, Skeleton, TextField } from '@mui/material';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import CustomButton from '../../components/Button';
import CustomToast from '../../components/CustomToast';
import FilteredSelect from '../../components/FilteredSelect';
import GoBackHeader from '../../components/GoBackHeader';
import { saveCarData, useCarData } from '../../lib/api/driverReqs';
import { CarDto } from '../../lib/api/driverReqs/driverTypes';
import { UseToastContext } from '../_app';

const colors = [
  'Rojo',
  'Azul',
  'Negro',
  'Blanco',
  'Gris',
  'Plateado',
  'Verde',
  'Amarillo',
  'Naranja',
  'Morado',
];

const AddCarPage = () => {
  const { data: car, isLoading, error } = useCarData();

  const carBrands = cars.map((car) => car.brand);

  const router = useRouter();

  const { openToast } = useContext(UseToastContext);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<AlertColor>('info');

  const [carModels, setCarModels] = useState<string[]>([]);

  const [carBrand, setCarBrand] = useState<string | null>(car?.brand || '');
  const [carModel, setCarModel] = useState<string | null>(car?.model || '');
  const [placa, setPlaca] = useState<string | null>(car?.plate || '');

  const [color, setColor] = useState<string | null>(car?.color || '');

  const [seat, setSeats] = useState<string | null>(car?.seats || '');

  if (!isLoading && error) {
    openToast('Ocurrió un error al obtener los datos del conductor', 'error');
    router.push('/driver');
  }

  const handleCarBrandChange = (value: string) => {
    setCarBrand(value);
  };

  const handleCarModelChange = (value: string) => {
    setCarModel(value);
  };

  const handleColorChange = (value: string) => {
    setColor(value);
  };

  const handleSeatChange = (value: string) => {
    setSeats(value);
  };

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // detect if the user is deleting the value
    if (e.target.value.length === 8) return;
    setPlaca(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!carBrand || !carModel || !placa || !color || !seat) {
      setToastMessage('Por favor, completa todos los campos');
      setToastSeverity('error');
      setIsToastOpen(true);
      return;
    }

    const data: CarDto = {
      brand: carBrand,
      model: carModel,
      plate: placa,
      color,
      seats: +seat,
    };

    const response = await saveCarData(data);

    if (response.status === 201) {
      openToast('Vehículo registrado con éxito', 'success');
      router.push('/driver');
    } else {
      openToast('Hubo un error al registrar el vehículo', 'error');
    }
  };

  useEffect(() => {
    if (carBrand) {
      const carModels = cars.find((car) => car.brand === carBrand)?.models;
      setCarModels(carModels || []);
    }
  }, [carBrand]);

  useEffect(() => {
    if (car) {
      setCarBrand(car.brand);
      setCarModel(car.model);
      setPlaca(car.plate);
      setColor(car.color);
      setSeats(car.seats.toString());
    }
  }, [car]);

  return (
    <MainLayout>
      <div className="w-full flex flex-col justify-start items-start md:w-1/2">
        <GoBackHeader onClick={() => router.push('/driver')} />
        <h1 className="text-[1.5rem] text-cxBlue font-semibold mt-5 ">
          Registrar Vehículo
        </h1>
        <form className="w-full" onSubmit={handleSubmit}>
          {isLoading ? (
            <Skeleton width="100%" height={50} />
          ) : (
            <div className="w-full my-5">
              <FilteredSelect
                options={carBrands}
                label="Marca"
                value={carBrand}
                onChange={handleCarBrandChange}
              />
            </div>
          )}
          <div className="w-full my-5">
            {isLoading ? (
              <Skeleton width="100%" height={50} />
            ) : (
              <FilteredSelect
                options={carModels}
                label="Modelo"
                value={carModel}
                onChange={handleCarModelChange}
                disabled={!carBrand}
              />
            )}
          </div>
          <div className="w-full my-5">
            {isLoading ? (
              <Skeleton width="100%" height={50} />
            ) : (
              <TextField
                id="outlined-basic"
                label="Placa"
                variant="outlined"
                fullWidth
                value={placa}
                onChange={handlePlacaChange}
                placeholder='Ej: "ABC1234"'
              />
            )}
          </div>

          <div className="w-full my-5">
            {isLoading ? (
              <Skeleton width="100%" height={50} />
            ) : (
              <FilteredSelect
                options={colors}
                label="Color"
                value={color}
                onChange={handleColorChange}
              />
            )}
          </div>

          <div className="w-full my-5">
            {isLoading ? (
              <Skeleton width="100%" height={50} />
            ) : (
              <FilteredSelect
                options={['1', '2', '3', ' 4', '5']}
                label="Asientos(sin incluir el conductor)"
                value={seat}
                onChange={handleSeatChange}
              />
            )}
          </div>

          <div className="w-full mt-5">
            <CustomButton variant="primary" type="submit">
              {car ? 'Actualizar' : 'Registrar'}
            </CustomButton>
          </div>
        </form>
      </div>
      <CustomToast
        open={isToastOpen}
        handleClose={() => setIsToastOpen(false)}
        message={toastMessage}
        severity={toastSeverity}
      />
    </MainLayout>
  );
};

export default AddCarPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { res } = context;
  const session = await getSession(context);

  if (!session) {
    res.writeHead(302, { Location: '/auth/login' });
    res.end();
    return {
      props: {},
    };
  }

  if (!session.user.isDriver) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return {
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};
