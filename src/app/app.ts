import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './shell/navbar/navbar';
import { Sidebar } from './shell/sidebar/sidebar';
import { DialogOutlet } from '@flights/shared/ui-common/dialog/dialog-outlet';

@Component({
  selector: 'app-root',
  imports: [Navbar, Sidebar, RouterOutlet, DialogOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('flights42');

  protected updateTitle(): void {
    this.title.set('Highly Sophisticated Flight App');
    console.log('Title updated', this.title());
  }
}
