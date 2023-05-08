/* eslint-disable no-unused-vars */
import { WeeklyTrip } from '@prisma/client';
import { place } from '../../types/trips';
import { CreateUserDto } from './api/generalTypes';

export function formatPlaca(val: string): string {
  let value = val;

  // Verificar si la longitud es igual a tres
  if (value.length === 3) {
    // Agregar guión al final del valor
    value = value + '-';
  }

  return value;
}

export const weekdays = [
  {
    value: 'MONDAY',
    label: 'Lunes',
  },
  {
    value: 'TUESDAY',
    label: 'Martes',
  },
  {
    value: 'WEDNESDAY',
    label: 'Miércoles',
  },
  {
    value: 'THURSDAY',
    label: 'Jueves',
  },
  {
    value: 'FRIDAY',
    label: 'Viernes',
  },
];
export const weekdaysForTripSearch = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export const englishToSpanishWeekdays = (day: string) => {
  return weekdays.find((weekday) => weekday.value === day)?.label;
};

// function to group trips per weekday
// function will recieve array of trips and should return object with weekdays as keys and array of trips as values
export const groupTrips = (trips: WeeklyTrip[]) => {
  const groupedTrips = {
    MONDAY: [] as WeeklyTrip[],
    TUESDAY: [] as WeeklyTrip[],
    WEDNESDAY: [] as WeeklyTrip[],
    THURSDAY: [] as WeeklyTrip[],
    FRIDAY: [] as WeeklyTrip[],
  };

  trips.forEach((trip) => {
    groupedTrips[trip.dayOfWeek as keyof typeof groupedTrips].push(trip);
  });

  return groupedTrips;
};

export const CetiData: place = {
  description: 'CETI',
  latitude: 20.702184,
  longitude: -103.3888693,
};

interface DataI extends CreateUserDto {
  confirmPassword: string;
}

export const validateSignupData = (data: DataI) => {
  let isValid = true;
  let errorMsg = '';

  const {
    firstName,
    firstLastName,
    secondLastName,
    email,
    password,
    confirmPassword,
    phoneNumber: phone,
  } = data;

  if (
    !firstName ||
    !firstLastName ||
    !secondLastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !phone
  ) {
    isValid = false;
    errorMsg = 'Todos los campos son obligatorios';
  }

  if (password !== confirmPassword) {
    isValid = false;
    errorMsg = 'Las contraseñas no coinciden';
  }

  if (phone.length !== 10) {
    isValid = false;
    errorMsg = 'El nÃ®mero de telÃ©fono debe tener 10 dígitos';
  }

  const emailRegex = new RegExp(
    '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
  );

  const emailDomain = email.split('@')[1];

  if (!emailRegex.test(email)) {
    isValid = false;
    errorMsg = 'El correo electrónico no es válido';
  }

  if (process.env.ONLY_CETI === 'True' && emailDomain !== 'ceti.mx') {
    isValid = false;
    errorMsg = 'El correo electrónico no es válido';
  }

  return {
    isValid,
    errorMsg,
  };
};

export const getDateTitle = (dayOfWeek: string, searchedDay: string) => {
  const weekday = `${weekdays.find((day) => day.value === dayOfWeek)?.label} `;

  const departureDate = new Date(searchedDay).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
  });

  return `${weekday} ${departureDate}`;
};

export const getFormattedDepartureTime = (departureTime: string) => {
  return new Date(departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const getDaysUntilTrip = (tripDate: string) => {
  const date = new Date(tripDate);
  const today = new Date();

  const diff = date.getTime() - today.getTime();

  const days = Math.ceil(diff / (1000 * 3600 * 24));

  return days;
};

export const encodeString = (str: string) => {
  return encodeURIComponent(str).replace(/%20/g, '+');
};

export const getWhatsappLink = (phone: string, message: string): string => {
  const baseUrl = 'https://api.whatsapp.com/send?phone=';
  const encodedMessage = encodeString(message);
  return `${baseUrl}${phone}&text=${encodedMessage}`;
};

export const formatWalkingTime = (walkingTime: number): string => {
  const hours = Math.floor(walkingTime / 3600);
  const minutes = Math.round((walkingTime % 3600) / 60);

  if (hours > 0) {
    return `${hours} hrs y ${minutes} min`;
  } else {
    return `${minutes} min`;
  }
};
