import {
  apply,
  applyWhenValue,
  disabled,
  hidden,
  minLength,
  readonly,
  required,
  min,
  schema,
  validateStandardSchema,
  applyWhen, applyEach, maxLength
} from '@angular/forms/signals';
import { FlightZodSchema, validateWithFlightSchema } from './flight-zod-schema';
import { signal } from '@angular/core';
import {
  validateCity,
  validateCityAsync,
  validateCityHttp, validateDuplicatePrices,
  validateRoundTrip,
  validateRoundTripTree
} from './flight-validators';
import { FlightFormModel } from './flight-model';
import { aircraftSchema } from './aircraft-schema';
import { priceSchema } from './price-schema';
import { FlightForm } from '../feature-booking/flight-edit/flight-form/flight-form';

export const delayedFlight = schema<FlightFormModel>((path) => {
  required(path.delay);
  min(path.delay, 15);
});


export const flightSchema = schema<FlightFormModel>((path) => {
  required(path.from);
  required(path.to);
  required(path.date);
  minLength(path.from, 3);
  maxLength(path.from, 30);

  // When the predicate is true, the schema 'delayedFlight' will be applied
  applyWhenValue(path, (flight) => flight.delayed, delayedFlight);

  // The predicate receives the current context, which provides access to the entire field state
  // Could also be ctx.stateOf() that returns the entire field state to check properties such as dirty for example
  // applyWhen(path, (ctx) => ctx.valueOf(path.delayed), delayedFlight);

  // another approach
  // required(path.delay, {
  //   when: (ctx) => ctx.valueOf(path.delayed),
  // });
  apply(path.aircraft, aircraftSchema);
  applyEach(path.prices, priceSchema);
  validateDuplicatePrices(path.prices);
});

// create schema based on schema
export const flightFormSchema = schema<FlightFormModel>((path) => {
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

  // validateCity(path.from, ['Graz', 'Hamburg', 'Zürich']);
  // validateCityAsync(path.from);
  validateCityHttp(path.from);

  validateRoundTrip(path);
  // validateRoundTripTree(path);
});

// schema with validation against a existing schema like Zod or Valibot for example
export const flightSchema2 = schema<FlightFormModel>((path) => {
  validateStandardSchema(path, FlightZodSchema);
  // ... other validation rules
});

// schema with conditional schema validation example
export const flightSchema3 = schema<FlightFormModel>((path) => {
  validateWithFlightSchema(path, signal<boolean>(true));
  // ... other validation rules
});
