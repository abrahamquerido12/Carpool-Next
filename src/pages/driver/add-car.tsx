import MainLayout from '@/layouts/MainLayout';
import cars from '@/lib/cars.json';
import { AlertColor, TextField } from '@mui/material';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CustomButton from '../../components/Button';
import CustomToast from '../../components/CustomToast';
import FilteredSelect from '../../components/FilteredSelect';
import GoBackHeader from '../../components/GoBackHeader';
import { saveCarData } from '../../lib/driverReqs';
import { CarDto } from '../../lib/driverReqs/driverTypes';
import prisma from '../../lib/prisma';

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

interface AddCarPageProps {
  carBrands: string[];
  driver: any;
}

const AddCarPage = (props: AddCarPageProps) => {
  const router = useRouter();
  const {
    carBrands,
    driver: { car },
  } = props;

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<AlertColor>('info');

  const [carModels, setCarModels] = useState<string[]>([]);

  const [carBrand, setCarBrand] = useState<string | null>(car?.brand || null);
  const [carModel, setCarModel] = useState<string | null>(car?.model || null);
  const [placa, setPlaca] = useState<string | null>(car?.plate || null);

  const [color, setColor] = useState<string | null>(car?.color || null);

  const [seat, setSeats] = useState<string | null>(car?.seats || null);

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
      // time to redirect to the driver dashboard
      setTimeout(() => {
        router.push('/driver');
      }, 2000);

      setToastMessage('Vehículo registrado con éxito');
      setToastSeverity('success');
      setIsToastOpen(true);
    } else {
      setToastMessage('Hubo un error al registrar el vehículo');
      setToastSeverity('error');
      setIsToastOpen(true);
    }
  };

  useEffect(() => {
    if (carBrand) {
      const carModels = cars.find((car) => car.brand === carBrand)?.models;
      setCarModels(carModels || []);
    }
  }, [carBrand]);

  return (
    <MainLayout>
      <div className="w-full flex flex-col justify-start items-start md:w-1/2">
        <GoBackHeader onClick={() => router.push('/driver')} />
        <h1 className="text-[1.5rem] text-cxBlue font-semibold mt-5 ">
          Registrar Vehículo
        </h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full my-5">
            <FilteredSelect
              options={carBrands}
              label="Marca"
              value={carBrand}
              onChange={handleCarBrandChange}
            />
          </div>
          <div className="w-full my-5">
            <FilteredSelect
              options={carModels}
              label="Modelo"
              value={carModel}
              onChange={handleCarModelChange}
              disabled={!carBrand}
            />
          </div>
          <div className="w-full my-5">
            <TextField
              id="outlined-basic"
              label="Placa"
              variant="outlined"
              fullWidth
              value={placa}
              onChange={handlePlacaChange}
              placeholder='Ej: "ABC1234"'
            />
          </div>

          <div className="w-full my-5">
            <FilteredSelect
              options={colors}
              label="Color"
              value={color}
              onChange={handleColorChange}
            />
          </div>

          <div className="w-full my-5">
            <FilteredSelect
              options={['1', '2', '3', ' 4', '5']}
              label="Asientos(sin incluir el conductor)"
              value={seat}
              onChange={handleSeatChange}
            />
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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      driver: {
        include: {
          car: true,
        },
      },
    },
  });

  const carBrands = cars.map((car) => car.brand);

  return {
    props: {
      session,
      carBrands,
      driver: JSON.parse(JSON.stringify(user?.driver)),
    },
  };
};
