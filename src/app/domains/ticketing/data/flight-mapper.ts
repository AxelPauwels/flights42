import { FlightFormModel, FlightDomainModel } from './flight-model';

export const toFlightFormModel = (model: FlightDomainModel): FlightFormModel => {
  return {
    ...model,
    delay: model.delay ?? 0,
  };
}

export const toFlightDomainModel = (model: FlightFormModel): FlightDomainModel => {
  return {
    ...model,
    delay: model.delayed ? model.delay : undefined,
  };
}
