import { Directive, inject, input, TemplateRef } from '@angular/core';
// Example Microsyntax (since they ar prefixed with the selector name):
// <div *appTableField="let data; provide: 'id'; title: 'Flight Id'">...</div>
// propName receives 'id' and title receives 'Flight Id'.
@Directive({
  selector: '[appTableField]',
})
export class TableField<T> {
  readonly propName = input.required<keyof T>({
    // eslint-disable-next-line @angular-eslint/no-input-rename
    alias: 'appTableFieldProvide',
  });
  readonly title = input.required<string>({ alias: 'appTableFieldTitle' });
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
