import { z } from 'zod';
import { SchemaPathTree, validateStandardSchema } from '@angular/forms/signals';
import { FlightFormModel } from './flight-model';
import { Signal } from '@angular/core';

export const FlightZodSchema = z.object({
  id: z.number().int(),
  from: z.string().min(3).max(20),
  to: z.string().min(3).max(20),
  date: z.string(),
  delayed: z.boolean(),
});

export const StrictFlightZodSchema = z.object({
  id: z.number().int(),
  from: z.string().min(10).max(30),
  to: z.string().min(10).max(30),
  date: z.string(),
  delayed: z.boolean(),
});

export function validateWithFlightSchema(path: SchemaPathTree<FlightFormModel>, strict: Signal<boolean>) {
  validateStandardSchema(path, () => (strict() ? StrictFlightZodSchema : FlightZodSchema));
}
