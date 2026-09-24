import { SchemaPathTree, validate } from '@angular/forms/signals';
import { Flight } from './flight';
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
