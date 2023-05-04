/* eslint-disable no-unused-vars */
import dayjs, { Dayjs } from 'dayjs';
import React, { SetStateAction } from 'react';
import { place } from '../../types/trips';

interface SearchTripCtxI {
  date: dayjs.Dayjs;
  setDate: (date: dayjs.Dayjs) => void;

  origin: place;
  setOrigin: (origin: place) => void;

  destination: place;
  setDestination: (destination: place) => void;

  departureTime: dayjs.Dayjs;
  setDepartureTime: React.Dispatch<SetStateAction<Dayjs>>;
}

export const SearchTripContext = React.createContext<SearchTripCtxI>({
  date: dayjs(new Date()),
  setDate: () => {},

  origin: {
    description: '',
    latitude: 0,
    longitude: 0,
  },
  setOrigin: () => {},

  destination: {
    description: '',
    latitude: 0,
    longitude: 0,
  },
  setDestination: () => {},

  departureTime: dayjs(new Date()),
  setDepartureTime: () => {},
});
