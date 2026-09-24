import { createMetadataKey, MetadataReducer } from '@angular/forms/signals';
//
// Property
//
export const CITY = createMetadataKey<boolean>();
//
// AggregateProperty
//
// If one validator sets CITY to true, and another one to false, the final value will be true
export const CITY2 = createMetadataKey(MetadataReducer.or());
//
// Custom reducer
//
const myOr: MetadataReducer<boolean, boolean> = {
  reduce(acc, item) {
    return acc || item;
  },
  getInitial() {
    return false;
  },
};
export const CITY3 = createMetadataKey(myOr);
