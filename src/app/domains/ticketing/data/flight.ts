import { Aircraft, initialAircraft } from './aircraft';
import { Price } from './price';
import { minLength, required, schema } from '@angular/forms/signals';

export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
  delay: number;
  aircraft: Aircraft;
  prices: Price[];
}

export const initialFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
  delay: 0,
  aircraft: initialAircraft,
  prices: [],
};

export const flightSchema = schema<Flight>((path) => {
  required(path.from);
  required(path.to);
  required(path.date);
  minLength(path.from, 3);
});
