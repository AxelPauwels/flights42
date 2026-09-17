import { JsonPipe } from '@angular/common';
import {
  afterEveryRender,
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
  untracked
} from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { Flight } from '../../data/flight';
import { HttpClient } from '@angular/common/http';
import { FlightCard } from '../../ui/flight-card/flight-card';
import { DelayStepper } from '../../../shared/ui-common/delay-stepper/delay-stepper';
// import { FlightZodSchema } from '../../data/flight-zod-schema';
// import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlightClient } from '../../data/flight-client';
import { DefaultLanguageService, LanguageService } from '../../../shared/util-common/language';

@Component({
  selector: 'app-flight-search',
  imports: [FormField, JsonPipe, RouterLink, FlightCard, DelayStepper],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Provide the DefaultLanguageService on the component level and children (overrides the app-level provider)
    // If this provider is the same as the app-level provider, it will still be a different instance than te app-level one.
    { provide: LanguageService, useClass: DefaultLanguageService },
    // short-hand for component, but should be injected like 'private languageService = inject(DefaultLanguageService);':
    // DefaultLanguageService,
  ],
})
export class FlightSearch {
  private readonly http = inject(HttpClient);
  private flightClient = inject(FlightClient);
  private readonly snackBar = inject(MatSnackBar);
  private languageService = inject(LanguageService);
  protected injector = inject(Injector);

  constructor() {
    this.showError();
    console.log('languageService', this.languageService.getUserLang());
  }

  protected readonly filter = signal({
    from: 'Hamburg',
    to: 'Graz',
  });
  protected readonly from = computed(() => this.filter().from);
  protected readonly to = computed(() => this.filter().to);
  protected readonly filterForm = form(this.filter);

  // Only tracks 'from', not 'to'
  protected readonly flightRoute = computed(() => {
    const origin = this.from(); // tracked
    const destination = untracked(() => this.to()); // NOT tracked
    return `${origin} → ${destination}`;
  });

  // Get the resource from the FlightClient service
  protected readonly flightsResource = this.flightClient.findResource(
    this.filterForm.from().value,
    this.filterForm.to().value,
  );

  // protected searchWithoutInjectionContext() {

  // this.flightClient = inject(FlightClient);// This would fail

  // assertInInjectionContext(this.searchWithoutInjectionContext); // This would fail too

  //   runInInjectionContext(
  //     this.injector,
  //     () => {
  //       const flightClient = inject(FlightClient);
  //       use flightClient here
  // },
  // );
  // }

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

  // protected readonly flightsResource = rxResource({
  //   params: () => ({
  //     ...this.filter(),
  //   }),
  //   stream: (loaderParams)  => {
  //     const params = loaderParams.params;
  //     return this._find(params.from, params.to);
  //   },
  //   defaultValue: [],
  // });

  // The main difference from the rxResource is that it uses a loader function that
  // returns a Promise instead of a stream function that returns an Observable.
  // Also, here, the API and semantics from the caller’s perspective are the same.
  // protected readonly flightsResource = resource({
  //   params: () => ({
  //     from: this.filter().from,
  //     to: this.filter().to,
  //   }),
  //   loader: (loaderParams) => {
  //     const c = loaderParams.params;
  //     const abortSignal = loaderParams.abortSignal;
  //     return this._findPromise(c.from, c.to, abortSignal);
  //   },
  //   defaultValue: [],
  // });

  // Get resource result and status
  protected readonly flights = this.flightsResource.value;
  protected readonly error = this.flightsResource.error;
  protected readonly isLoading = this.flightsResource.isLoading;

  protected readonly delayInMin = signal(0);
  protected readonly flightsWithDelays = computed(() =>
    toFlightsWithDelays(this.flights(), this.delayInMin()),
  );
  protected readonly basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });
  protected readonly maxDelay = signal(0);

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

  protected delay(): void {
    this.delayInMin.update((delayInMin) => delayInMin + 15);
  }

  private _find(from: string, to: string, urgent = false): Observable<Flight[]> {
    const url = `https://demo.angulararchitects.io/api/flight`;
    const headers = {
      Accept: 'application/json',
    };
    const params = { from, to, urgent };
    return this.http.get<Flight[]>(url, { headers, params });
  }

  private _findPromise(from: string, to: string, abortSignal?: AbortSignal): Promise<Flight[]> {
    const aborted = new Subject<void>();
    abortSignal?.addEventListener('abort', () => {
      aborted.next();
    });
    const flightsObservable = this._find(from, to).pipe(takeUntil(aborted));
    // As the HttpClient always returns an Observable, our implementation of
    // findPromise needs to convert it to a Promise.
    return firstValueFrom(flightsObservable);
  }

  private showError() {
    effect(() => {
      const error = this.error();
      if (error || this.filter().to === 'error') {
        const message = 'Error loading flights: ' + error;
        this.snackBar.open(message, 'OK');
      }
    });

    afterRenderEffect(() => {
      // DOM manipulation here
    });

    afterNextRender(() => {
      const filter = this.filter();
      console.log('After Next Render: from', filter.from, '-> to', filter.to);
    });

    afterEveryRender(() => {
      const filter = this.filter();
      console.log('After Every Render: from', filter.from, '-> to', filter.to);
    });
  }
}

function toFlightsWithDelays(flights: Flight[], delay: number): Flight[] {
  if (flights.length === 0) {
    return [];
  }

  const ONE_MINUTE = 1000 * 60;
  const oldFlights = flights;
  const oldFlight = oldFlights[0];
  const oldDate = new Date(oldFlight.date);
  const newDate = new Date(oldDate.getTime() + delay * ONE_MINUTE);
  const newFlight = { ...oldFlight, date: newDate.toISOString() };

  return [newFlight, ...flights.slice(1)];
}

