import { ActivatedRoute } from '@angular/router';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { SimpleFlightDetailStore } from './simple-flight-detail-store';
import { Flight, flightSchema } from '../../data/flight';
import { form, FormField, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-flight-edit',
  imports: [FormField, JsonPipe],
  templateUrl: './flight-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightEdit {
  // private readonly route = inject(ActivatedRoute);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(SimpleFlightDetailStore);
  protected readonly flight = linkedSignal(() => normalizeFlight(this.store.flight()));

  // protected readonly id = signal(0);
  // protected readonly showDetails = signal(false);

  // constructor() {
  // this.route.paramMap.subscribe((paramsMap) => {
  //   const flightId = parseInt(paramsMap.get('id') ?? '0');
  //   this.id.set(flightId);
  //   const showDetails = (paramsMap.get('showDetails') === 'true');
  //   this.showDetails.set(showDetails);
  // });
  // }

  // Set up the Signal Form with validation rules
  protected readonly flightForm = form(this.flight, flightSchema);

  protected readonly id = input.required({
    transform: numberAttribute,
  });
  protected readonly showDetails = input({
    transform: booleanAttribute,
  });

  // constructor() {
  // effect(() => {
  //   console.log('id', this.id());
  //   console.log('showDetails', this.showDetails());
  // });
  //
  // this.activatedRoute.queryParamMap.subscribe((queryParamMap) => {
  //   // Key-value pairs of the query string
  //   console.log('subscribe queryParamMap = ', queryParamMap);
  // });
  //
  // this.activatedRoute.fragment.subscribe((fragment) => {
  //   // One string representing the hash fragment
  //   console.log('subscribe fragment = ', fragment);
  // });
  // }
}

function normalizeFlight(flight: Flight): Flight {
  const localDate = flight.date.substring(0, 16);
  return {
    ...flight,
    date: localDate,
  };
}
