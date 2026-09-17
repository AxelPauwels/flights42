import { inject, Service, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Flight } from './flight';
import { ConfigService } from '../../shared/util-common/config-service';

@Service()
export class FlightClient {
  private configService = inject(ConfigService);

  findResource(from: Signal<string>, to: Signal<string>) {
    return httpResource<Flight[]>(
      () => {
        if (!from() || !to()) {
          return undefined; // Indicating that no request should be made.
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
      },
    );
  }
}
