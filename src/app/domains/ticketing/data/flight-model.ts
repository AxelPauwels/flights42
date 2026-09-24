import { Aircraft, initialAircraft } from './aircraft';
import { Price } from './price';

export interface FlightDomainModel {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
  delay?: number; // optional
  aircraft: Aircraft;
  prices: Price[];
}

export interface FlightFormModel {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
  delay: number; // not optional in form model
  aircraft: Aircraft;
  prices: Price[];
}

export const initialFlight: FlightDomainModel = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
  delay: 0,
  aircraft: initialAircraft,
  prices: [],
};
