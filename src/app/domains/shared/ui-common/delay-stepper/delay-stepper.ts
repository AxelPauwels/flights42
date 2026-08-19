import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-delay-stepper',
  imports: [],
  templateUrl: './delay-stepper.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './delay-stepper.css',
})
export class DelayStepper implements FormValueControl<number> {
  readonly value = model(0);

  protected inc(): void {
    this.value.update((v) => v + 15);
  }

  protected dec(): void {
    this.value.update((v) => Math.max(v - 15, 0));
  }
}
