import { FlightFormModel, Flight } from './flight-model';

export const toFlightFormModel = (model: Flight): FlightFormModel => {
  return {
    ...model,
    delay: model.delay ?? 0,
  };
}

export const toFlightDomainModel = (model: FlightFormModel): Flight => {
  return {
    ...model,
    delay: model.delayed ? model.delay : undefined,
  };
}
