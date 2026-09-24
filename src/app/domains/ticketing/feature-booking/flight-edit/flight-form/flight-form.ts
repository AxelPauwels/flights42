import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

import { DelayStepper } from '../../../../shared/ui-common/delay-stepper/delay-stepper';
import { ValidationErrorsPane } from '../../../../shared/ui-forms/validation-errors/validation-errors-pane';
import { Flight } from '../../../data/flight';

@Component({
  selector: 'app-flight-form',
  imports: [
    FormField,
    ValidationErrorsPane,
    DelayStepper,
  ],
  templateUrl: './flight-form.html',
})
export class FlightForm {
  flight = input.required<FieldTree<Flight, string | number>>();
}
