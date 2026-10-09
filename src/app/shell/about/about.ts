import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TabbedPane } from '@flights/shared/ui-common/query-tabbed-pane/tabbed-pane';
import { Tab } from '@flights/shared/ui-common/query-tabbed-pane/tab';
import { ClickWithWarning } from '@flights/shared/ui-common/click-with-warning.directive';
import { SimpleTooltip } from '@flights/shared/ui-common/simple-tooltip';
import { Tooltip } from '@flights/shared/ui-common/tooltip';
import { DataTable } from '@flights/shared/ui-common/data-table/data-table';
import { TableField } from '@flights/shared/ui-common/data-table/table-field';
import { DatePipe } from '@angular/common';
import { Flight } from '@flights/ticketing/data/flight-model';

@Component({
  selector: 'app-about',
  imports: [TabbedPane, Tab, ClickWithWarning, SimpleTooltip, Tooltip, DataTable, TableField, DatePipe],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly flights = signal<Flight[]>([
    {
      id: 1,
      from: 'Hamburg',
      to: 'Berlin',
      date: '2025-02-01T17:00+01:00',
      delayed: false,
      delay: 0,
      aircraft: { type: 'Airbus', registration: 'Airbus  A320' },
      prices: []
    },
  ]);

  deleteAll(): void {
    console.log('Delete all clicked');
  };
}

export default About;
