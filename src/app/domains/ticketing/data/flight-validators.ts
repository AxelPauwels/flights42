import {
  SchemaPath,
  SchemaPathTree,
  validate,
  validateAsync,
  validateHttp,
  validateTree
} from '@angular/forms/signals';
import { Flight } from './flight';
import { delay, map, Observable, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Price } from './price';
export const validateCity = (path: SchemaPathTree<string>, allowed: string[])=> {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (allowed.includes(value)) {
      return null;
    }

    return {
      kind: 'Unallowed city',
      value,
      allowed,
    };
  });
}

// here we are validating against the full path. so errors will be at top level -> [errors]="flightForm().errorSummary()"
export const validateRoundTrip = (path: SchemaPathTree<Flight>) => {
  validate(path, (ctx) => {
    const from = ctx.fieldTree.from().value();
    const to = ctx.fieldTree.to().value();

    // Alternative:
    // const from = ctx.valueOf(path.from);
    // const to = ctx.valueOf(path.to);

    if (from === to) {
      return {
        kind: 'roundtrip',
        from,
        to,
      };
    }

    return null; // Passes validation
  });
}

export const validateRoundTrip2 = (path: SchemaPathTree<Flight>) => {
  // Now, we are validating the 'from' field only
  // In this case, the error message appears in the from field’s errors array -> [errors]="flightForm.from().errors()"
  validate(path.from, (ctx) => {
    const from = ctx.value();
    const to = ctx.valueOf(path.to);

    if (from === to) {
      return {
        kind: 'roundtrip',
        from,
        to,
      };
    }

    return null;
  });
}

// Tree validators are special multi-field validators that can define error messages for all levels of a field tree.
// To do so, they store the affected field in the ValidationError object
export const validateRoundTripTree = (path: SchemaPathTree<Flight>) => {
  validateTree(path, (ctx) => {
    const from = ctx.fieldTree.from().value();
    const to = ctx.fieldTree.to().value();

    if (from === to) {
      return {
        kind: 'roundtrip_tree',
        field: ctx.fieldTree.from,
        from,
        to,
      };
    }

    return null;
  });
}

export function validateCityAsync(path: SchemaPathTree<string>) {
  validateAsync(path, {
    params: (ctx) => ({
      value: ctx.value(),
    }),
    factory: (params) => {
      return rxResource({
        params,
        stream: (p) => {
          return rxValidateAirport(p.params.value);
        },
      });
    },
    onSuccess: (result: boolean, _ctx) => {
      if (!result) {
        return {
          kind: 'airport_not_found_http',
        };
      }

      return null;
    },
    onError: (error, _ctx) => {
      console.error('api error validating city', error);

      return {
        kind: 'api-failed',
      };
    },
  });
}

// Simulates a server-side validation
function rxValidateAirport(airport: string): Observable<boolean> {
  const allowed = ['Graz', 'Hamburg', 'Zürich'];
  return of(null).pipe(
    delay(2000),
    map(() => allowed.includes(airport)),
  );
}

export const validateCityHttp = (path: SchemaPathTree<string>) => {
  validateHttp(path, {
    request: (ctx) => ({
      url: 'https://demo.angulararchitects.io/api/flight',
      params: {
        from: ctx.value(),
      },
    }),
    onSuccess: (result: Flight[], _ctx) => {
      if (result.length === 0) {
        return {
          kind: 'airport_not_found_http',
        };
      }
      return null;
    },
    onError: (error, _ctx) => {
      console.error('api error validating city', error);
      return {
        kind: 'api-failed',
      };
    },
  });
}

export const validateDuplicatePrices = (path: SchemaPath<Price[]>) => {
  validate(path, (ctx) => {
    const prices = ctx.value();
    const flightClasses = new Set<string>();

    for (const price of prices) {
      if (flightClasses.has(price.flightClass)) {
        return {
          kind: 'duplicateFlightClass',
          message:
            'There can only be one price per flight class (FlightClass' + price.flightClass + ')',
          flightClass: price.flightClass,
        };
      }
      flightClasses.add(price.flightClass);
    }
    return null;
  });
}
