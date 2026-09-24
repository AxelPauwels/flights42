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
  applyWhen
} from '@angular/forms/signals';
import { FlightZodSchema, validateWithFlightSchema } from './flight-zod-schema';
import { signal } from '@angular/core';
import {
  validateCity,
  validateCityAsync,
  validateCityHttp,
  validateRoundTrip,
  validateRoundTripTree
} from './flight-validators';
import { Flight } from './flight';

export const delayedFlight = schema<Flight>((path) => {
  required(path.delay);
  min(path.delay, 15);
});


export const flightSchema = schema<Flight>((path) => {
  required(path.from);
  required(path.to);
  required(path.date);
  minLength(path.from, 3);

  // When the predicate is true, the schema 'delayedFlight' will be applied
  applyWhenValue(path, (flight) => flight.delayed, delayedFlight);

  // The predicate receives the current context, which provides access to the entire field state
  // Could also be ctx.stateOf() that returns the entire field state to check properties such as dirty for example
  // applyWhen(path, (ctx) => ctx.valueOf(path.delayed), delayedFlight);

  // another approach
  // required(path.delay, {
  //   when: (ctx) => ctx.valueOf(path.delayed),
  // });
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

  // validateCity(path.from, ['Graz', 'Hamburg', 'Zürich']);
  // validateCityAsync(path.from);
  validateCityHttp(path.from);

  validateRoundTrip(path);
  // validateRoundTripTree(path);
});

// schema with validation against a existing schema like Zod or Valibot for example
export const flightSchema2 = schema<Flight>((path) => {
  validateStandardSchema(path, FlightZodSchema);
  // ... other validation rules
});

// schema with conditional schema validation example
export const flightSchema3 = schema<Flight>((path) => {
  validateWithFlightSchema(path, signal<boolean>(true));
  // ... other validation rules
});
