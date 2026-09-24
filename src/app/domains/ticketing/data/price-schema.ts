import { min, required, schema } from '@angular/forms/signals';
import { Price } from './price';
export const priceSchema = schema<Price>((path) => {
  required(path.flightClass);
  required(path.amount);
  min(path.amount, 0);
});
