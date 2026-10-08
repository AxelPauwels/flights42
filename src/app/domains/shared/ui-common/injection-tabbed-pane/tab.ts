import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { TabbedPane } from './tabbed-pane';

@Component({
  selector: 'app-tab',
  imports: [],
  template: `
    @if (visible()) {
      <div class="tab-content">
        <ng-content></ng-content>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .tab-content {
      animation: fadeIn 0.2s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
})
export class Tab {
  // To ensure that the Tab also works without a parent TabbedPane, inject with optional: true
  // If Angular cannot find an implementation for the token, it returns undefined.
  private pane = inject(TabbedPane, { optional: true });
  readonly title = input.required<string>();

  protected readonly visible = computed(() => this.pane?.currentTab() === this);

  constructor() {
    this.pane?.registerTab(this);
  }
}
