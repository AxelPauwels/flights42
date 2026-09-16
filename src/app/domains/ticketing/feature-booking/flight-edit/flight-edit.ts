import { ActivatedRoute } from '@angular/router';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, effect,
  inject,
  input,
  numberAttribute,
  signal
} from '@angular/core';

@Component({
  selector: 'app-flight-edit',
  imports: [],
  templateUrl: './flight-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightEdit {
  // private readonly route = inject(ActivatedRoute);
  private readonly activatedRoute = inject(ActivatedRoute);

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

  protected readonly id = input.required({
    transform: numberAttribute,
  });
  protected readonly showDetails = input({
    transform: booleanAttribute,
  });

  constructor() {
    effect(() => {
      console.log('id', this.id());
      console.log('showDetails', this.showDetails());
    });

    this.activatedRoute.queryParamMap.subscribe((queryParamMap) => {
      // Key-value pairs of the query string
      console.log('subscribe queryParamMap = ', queryParamMap);
    });

    this.activatedRoute.fragment.subscribe((fragment) => {
      // One string representing the hash fragment
      console.log('subscribe fragment = ', fragment);
    });
  }
}
