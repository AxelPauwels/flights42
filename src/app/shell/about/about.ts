import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabbedPane } from '@flights/shared/ui-common/query-tabbed-pane/tabbed-pane';
import { Tab } from '@flights/shared/ui-common/query-tabbed-pane/tab';
import { ClickWithWarning } from '@flights/shared/ui-common/click-with-warning.directive';

@Component({
  selector: 'app-about',
  imports: [TabbedPane, Tab, ClickWithWarning],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}

export default About;
