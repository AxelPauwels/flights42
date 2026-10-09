import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  template: `
    <div class="card">
      <div class="card-body">
        <p>
          {{ message }}
        </p>
        <button (click)="close(true)" class="btn btn-default">Yes</button>
        <button (click)="close(false)" class="btn btn-default">No</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    button {
      margin-right: 5px;
    }
    .card-body {
      padding: 0 10px;
      margin-bottom: 15px;
    }
  `,
})
export class ConfirmComponent {
  protected readonly message = inject<string>(DIALOG_DATA);
  private readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);

  close(decision: boolean): void {
    this.dialogRef.close(decision);
  }
}
