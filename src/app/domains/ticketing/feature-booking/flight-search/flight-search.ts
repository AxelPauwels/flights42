import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { Flight } from '../../data/flight';
import { HttpClient, httpResource } from '@angular/common/http';
import { FlightCard } from '../../ui/flight-card/flight-card';
import { DelayStepper } from '../../../shared/ui-common/delay-stepper/delay-stepper';
import { FlightZodSchema } from '../../data/flight-zod-schema';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-flight-search',
  imports: [FormField, JsonPipe, FlightCard, DelayStepper],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {
  private readonly http = inject(HttpClient);

  protected readonly filter = signal({
    from: 'Hamburg',
    to: 'Graz',
  });
  protected readonly from = computed(() => this.filter().from);
  protected readonly to = computed(() => this.filter().to);

  // Only tracks 'from', not 'to'
  protected readonly flightRoute = computed(() => {
    const origin = this.from(); // tracked
    const destination = untracked(() => this.to()); // NOT tracked
    return `${origin} → ${destination}`;
  });

  // protected readonly flightsResource = httpResource<Flight[]>(
  //   () => {
  //     const filter = this.filter();
  //     if (!filter.from || !filter.to) {
  //       return undefined;
  //     }
  //
  //     return {
  //       url: 'https://demo.angulararchitects.io/api/flight',
  //       params: {
  //         from: filter.from,
  //         to: filter.to,
  //       },
  //     };
  //   },
  //   {
  //     defaultValue: [],
  //     // parse: (raw) => FlightZodSchema.array().parse(raw),
  //   },
  // );

  protected readonly flightsResource = rxResource({
    params: () => ({
      ...this.filter(),
    }),
    stream: (loaderParams):Observable<Flight[]> => {
      const params = loaderParams.params;
      return this._find(params.from, params.to);
    },
    defaultValue: [],
  });

  // Get resource result and status
  protected readonly flights = this.flightsResource.value;
  protected readonly error = this.flightsResource.error;
  protected readonly isLoading = this.flightsResource.isLoading;

  protected readonly basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });
  protected readonly maxDelay = signal(0);

  protected readonly filterForm = form(this.filter);
  protected readonly selectedFlight = signal<Flight | null>(null);
  protected search(): void {
    this.flightsResource.reload();
  }

  protected select(f: Flight): void {
    this.selectedFlight.set(f);
  }

  protected updateBasket(flightId: number, selected: boolean): void {
    this.basket.update((basket) => ({
      ...basket,
      [flightId]: selected,
    }));
  }

  private _find(from: string, to: string, urgent = false): Observable<Flight[]> {
    const url = `https://demo.angulararchitects.io/api/flight`;
    const headers = {
      Accept: 'application/json',
    };
    const params = { from, to, urgent };
    return this.http.get<Flight[]>(url, { headers, params });
  }
}
