import { ActivatedRoute } from '@angular/router';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  numberAttribute, signal,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { SimpleFlightDetailStore } from './simple-flight-detail-store';
import { Flight } from '../../data/flight';
import { FieldTree, form, FormField, FormRoot, submit } from '@angular/forms/signals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidationErrorsPane } from '../../../shared/ui-forms/validation-errors/validation-errors-pane';
import { flightFormSchema } from '../../data/flight-schema';
import { initialPrice } from '../../data/price';

@Component({
  selector: 'app-flight-edit',
  imports: [FormField, JsonPipe, FormRoot, ValidationErrorsPane],
  templateUrl: './flight-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(SimpleFlightDetailStore);
  protected readonly flight = linkedSignal(() => normalizeFlight(this.store.flight()));
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.route.paramMap.subscribe((paramsMap) => {
      const flightId = parseInt(paramsMap.get('id') ?? '0');
      this.store.setFlightId(flightId);
    });
  }

  // Set up the Signal Form with validation rules
  protected readonly flightForm = form(this.flight, flightFormSchema, {
    submission: {
      action: async (form) => this.save(form),
      ignoreValidators: 'none',
      onInvalid: (form) => this.reportValidationError(form),
    },
  });

  protected async requestApproval(): Promise<void> {
    await submit(this.flightForm, {
      action: async (form) => {
        console.log('Requesting approval for flight:', form().value());
        await this.store.requestApproval(form().value());
      },
      ignoreValidators: 'none',
      onInvalid: (form) => this.reportValidationError(form),
    });
  }

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

  protected async save(form: FieldTree<Flight>) {
    try {
      await this.store.saveFlight(form().value());
      return null;
    } catch (error) {
      return {
        kind: 'processing_error',
        error: error,
      };
    }
  }

  protected addPrice(): void {
    this.flight.update((flight)=> {
      const prices = [...flight.prices, { ...initialPrice }];

      return {
        ...flight,
        prices
      }
    });
  }

  private reportValidationError(form: FieldTree<Flight>): void {
    this.snackBar.open('Please correct the validation errors', 'OK');
    this.focusInvalid(form);
  }

  private focusInvalid(form: FieldTree<Flight>) {
    const errors = form().errorSummary();
    if (errors.length > 0) {
      errors[0].fieldTree().focusBoundControl();
    }
  }
}

function normalizeFlight(flight: Flight): Flight {
  const localDate = flight.date.substring(0, 16);
  return {
    ...flight,
    date: localDate,
  };
}

