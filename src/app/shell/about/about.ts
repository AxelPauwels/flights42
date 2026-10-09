import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabbedPane } from '@flights/shared/ui-common/query-tabbed-pane/tabbed-pane';
import { Tab } from '@flights/shared/ui-common/query-tabbed-pane/tab';
import { ClickWithWarning } from '@flights/shared/ui-common/click-with-warning.directive';
import { SimpleTooltip } from '@flights/shared/ui-common/simple-tooltip';

@Component({
  selector: 'app-about',
  imports: [TabbedPane, Tab, ClickWithWarning, SimpleTooltip],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  deleteAll(): void {
    console.log('Delete all clicked');
  };
}

export default About;
