import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { Flight } from '../../data/flight';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-flight-card',
  imports: [DatePipe],
  templateUrl: './flight-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCard {
  readonly item = input.required<Flight>();
  readonly selected = model(false);

  protected select() {
    this.selected.set(true);
  }

  protected deselect() {
    this.selected.set(false);
  }
}
