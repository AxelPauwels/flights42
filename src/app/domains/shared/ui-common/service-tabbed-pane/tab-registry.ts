import { computed, Service, Signal, signal } from '@angular/core';

export interface TabInfo {
  title: Signal<string>;
}

// This service is provided in the tabbed-pane, so each tabbed-pane has its own instance of the service.
// `autoProvided: false` : the service is provided per tabbed-pane, // not in the root scope.
@Service({ autoProvided: false })
export class TabRegistry {
  private readonly _current = signal(0);
  private readonly _tabs = signal<TabInfo[]>([]);

  readonly current = this._current.asReadonly();
  readonly tabs = this._tabs.asReadonly();
  readonly currentTab = computed(() => this.tabs()[this.current()]);

  registerTab(tab: TabInfo): void {
    this._tabs.update((tabs) => [...tabs, tab]);
  }

  activate(tabIndex: number): void {
    this._current.set(tabIndex);
  }
}
