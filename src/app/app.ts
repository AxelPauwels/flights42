import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('flights42');

  protected updateTitle(): void {
    this.title.set('Highly Sophisticated Flight App');
    console.log('Title updated', this.title());
  }
}
