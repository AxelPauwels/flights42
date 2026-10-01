import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Dispatcher, injectDispatch } from '@ngrx/signals/events';

import { LuggageCard } from '../luggage-card/luggage-card';
import { luggageEvents, LuggageStore } from './luggage-store';

@Component({
  selector: 'app-luggage',
  imports: [LuggageCard],
  templateUrl: './luggage-overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LuggageOverview {
  private readonly _store = inject(LuggageStore);
  private readonly _dispatcher = inject(Dispatcher);
  private readonly _dispatch = injectDispatch(luggageEvents);

  protected readonly luggage = this._store.luggage;
  protected readonly selected = this._store.selected;

  constructor() {
    // this._dispatcher.dispatch(
    //   luggageEvents.loadLuggageTriggered({
    //     passengerId: 4711,
    //   }),
    // );
    this._dispatch.loadLuggageTriggered({ passengerId: 4711 });
  }

  protected updateSelected(luggageId: number, selected: boolean): void {
    this._store.updateSelected(luggageId, selected);
  }
}
