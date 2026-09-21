import { Aircraft, initialAircraft } from './aircraft';
import { Price } from './price';
import { apply, disabled, hidden, minLength, readonly, required, schema } from '@angular/forms/signals';

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

// create schema based on schema
export const flightFormSchema = schema<Flight>((path) => {
  apply(path, flightSchema); // include all rules defined in flightSchema
  required(path.id); // Additional rules...
  disabled(path.delay, {
    when: (ctx) => (ctx.valueOf(path.delayed) ? false : 'not delayed'),
  });
  readonly(path.delay, {
    when: (ctx) => ctx.valueOf(path.delayed),
  });
  hidden(path.delay, {
    when: (ctx) => !ctx.valueOf(path.delayed),
  });
});
