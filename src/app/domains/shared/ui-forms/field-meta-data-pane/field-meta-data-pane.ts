import { Component, computed, input } from '@angular/core';
import { FieldTree, REQUIRED, MIN_LENGTH, MAX_LENGTH } from '@angular/forms/signals';

@Component({
  selector: 'app-field-meta-data-pane',
  imports: [],
  templateUrl: './field-meta-data-pane.html',
})
export class FieldMetaDataPane {
  readonly field = input.required<FieldTree<unknown>>();
  protected readonly fieldState = computed(
    () => this.field()()
  );
  protected readonly isRequired = computed(
    () => this.fieldState().metadata(REQUIRED)?.() ?? false
  );
  protected readonly minLength = computed(
    () => this.fieldState().metadata(MIN_LENGTH)?.() ?? 0
  );
  protected readonly maxLength = computed(
    () => this.fieldState().metadata(MAX_LENGTH)?.() ?? 30
  );
  protected readonly length = computed(
    () => `(${this.minLength()}..${this.maxLength()})`
  );
}
