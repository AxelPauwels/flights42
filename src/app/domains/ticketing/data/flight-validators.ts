import { SchemaPathTree, validate } from '@angular/forms/signals';
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
