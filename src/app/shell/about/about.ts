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
import { AdvancedDataTable } from '@flights/shared/ui-common/advanced-data-table/advanced-data-table';

@Component({
  selector: 'app-about',
  imports: [
    TabbedPane,
    Tab,
    ClickWithWarning,
    SimpleTooltip,
    Tooltip,
    DataTable,
    TableField,
    DatePipe,
    AdvancedDataTable,
  ],
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
      prices: [],
    },
    {
      id: 2,
      from: 'Hamburg',
      to: 'Stockholm',
      date: '2025-09-01T17:00+11:00',
      delayed: false,
      delay: 0,
      aircraft: { type: 'Airbus', registration: 'Airbus  A65' },
      prices: [],
    },
    {
      id: 3,
      from: 'Pizza',
      to: 'Hamburg',
      date: '2025-12-01T17:00+03:00',
      delayed: true,
      delay: 50000,
      aircraft: { type: 'Boeing', registration: 'Boeing 737' },
      prices: [],
    },
    {
      id: 4,
      from: 'Belgium',
      to: 'France',
      date: '2025-04-01T17:00+01:00',
      delayed: false,
      delay: 0,
      aircraft: { type: 'Spacer', registration: 'Spacer AVV' },
      prices: [],
    },
    {
      id: 5,
      from: 'Spain',
      to: 'America',
      date: '2025-02-01T17:00+01:00',
      delayed: false,
      delay: 0,
      aircraft: { type: 'Spacer', registration: 'Spacer CX' },
      prices: [],
    },
  ]);

  deleteAll(): void {
    console.log('Delete all clicked');
  }
}

export default About;
