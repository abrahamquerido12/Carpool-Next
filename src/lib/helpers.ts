import { WeeklyTrip } from '@prisma/client';
import { place } from '../../types/trips';

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
