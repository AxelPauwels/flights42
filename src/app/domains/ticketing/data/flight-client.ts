import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ConfigService } from '../../shared/util-common/config-service';
import { initialAircraft } from './aircraft';
import { FlightDomainModel, initialFlight } from './flight-model';

@Service()
export class FlightClient {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  find(from: string, to: string, urgent = false): Observable<FlightDomainModel[]> {
    const url = `${this.configService.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { from, to, urgent };

    return this.http
      .get<FlightDomainModel[]>(url, { headers, params })
      .pipe(map((flights) => flights.map(initializeFlight)));
  }

  findResource(from: Signal<string>, to: Signal<string>) {
    return httpResource<FlightDomainModel[]>(
      () => {
        if (!from() || !to()) {
          return undefined;
        }

        return {
          url: `${this.configService.baseUrl}/flight`,
          headers: {
            Accept: 'application/json',
          },
          params: {
            from: from(),
            to: to(),
          },
        };
      },
      {
        defaultValue: [],
        // parse: (raw) => FlightZodSchema.array().parse(raw) as Flight[]
        parse: (raw) => {
          const flights = raw as FlightDomainModel[];
          return flights.map((flight) => initializeFlight(flight));
        },
      },
    );
  }

  // Alternative implementation using rxResource
  // findRxResource(from: Signal<string>, to: Signal<string>) {
  //   return rxResource({
  //     params: () => ({
  //       from: from(),
  //       to: to(),
  //     }),
  //     stream: (loaderParams) => {
  //       const c = loaderParams.params;
  //       return this.find(c.from, c.to);
  //     },
  //     defaultValue: [],
  //   });
  // }

  // Alternative implementation using a promise-based resourced
  // findPromiseResource(from: Signal<string>, to: Signal<string>) {
  //   return resource({
  //     params: () => ({
  //       from: from(),
  //       to: to(),
  //     }),
  //     loader: (loaderParams) => {
  //       const c = loaderParams.params;
  //       return firstValueFrom(this.find(c.from, c.to));
  //     },
  //     defaultValue: [],
  //   });
  // }

  findById(id: string): Observable<FlightDomainModel> {
    const url = `${this.configService.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { id };

    return this.http.get<FlightDomainModel>(url, { headers, params });
  }

  findResourceById(id: Signal<number>) {
    return httpResource<FlightDomainModel>(
      () => {
        const current = id();
        // Do not call the backend when no valid id is set (e.g., initial 0)
        if (!current) {
          return undefined;
        }

        return {
          url: `${this.configService.baseUrl}/flight`,
          headers: {
            Accept: 'application/json',
          },
          params: {
            id: current,
          },
        };
      },
      // TODO: Extend Service
      {
        defaultValue: initialFlight,
        parse: (raw) => {
          return initializeFlight(raw);
        },
      },
    );
  }

  create(flight: FlightDomainModel): Observable<FlightDomainModel> {
    const url = `${this.configService.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    return this.http.post<FlightDomainModel>(url, flight, { headers });
  }

  update(flight: FlightDomainModel): Observable<FlightDomainModel> {
    const url = `${this.configService.baseUrl}/flight/${flight.id}`;

    const headers = {
      Accept: 'application/json',
    };

    return this.http.put<FlightDomainModel>(url, flight, { headers });
  }

  // createSaveNxMutation(options: Partial<RxMutationOptions<Flight, Flight>>) {
  //   return rxMutation({
  //     ...options,
  //     operation: (flight: Flight) => this.update(flight),
  //   });
  // }

  // createSaveMutation(options: Partial<HttpMutationOptions<Flight, Flight>>) {
  //   return httpMutation({
  //     ...options,
  //     request: (flight: Flight) => ({
  //       url: `${this.configService.baseUrl}/flight/${flight.id}`,
  //       method: 'PUT',
  //       body: flight,
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     }),
  //   });
  // }
}
function initializeFlight(raw: unknown) {
  const flight = raw as FlightDomainModel;
  flight.aircraft = initialAircraft;
  flight.prices = [];
  flight.delay = flight.delayed ? 15 : 0;
  return flight;
}
