import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-booking-navigation',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './booking-navigation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingNavigation {}
