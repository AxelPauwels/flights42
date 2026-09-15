import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { isActive, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly router = inject(Router);
  // ... one signal per menu entry
  protected readonly homeActive = isActive('/home', this.router);
}
