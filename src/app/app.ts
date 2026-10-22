import { Component, signal, ChangeDetectionStrategy, inject, PLATFORM_ID } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';

import { Navbar } from './shell/navbar/navbar';
import { Sidebar } from './shell/sidebar/sidebar';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Navbar, Sidebar, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  protected readonly isLoading = signal(false);
  protected readonly title = signal('Flights');
  private readonly platformId = inject(PLATFORM_ID);


  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running in the browser');
    }

    if (isPlatformServer(this.platformId)) {
      console.log('Running in the server');
    }

    this.router.events.subscribe((events) => {
      if (events instanceof NavigationStart) {
        this.isLoading.set(true);
        console.log('Navigation isLoading true');
      } else if (
        events instanceof NavigationEnd ||
        events instanceof NavigationError ||
        events instanceof NavigationCancel
      ) {
        this.isLoading.set(false);
        console.log('Navigation isLoading false');
      }
    });
  }

  protected updateTitle(): void {
    this.title.set('Highly Sophisticated Flight App');
    console.log('Title updated', this.title());
  }
}
