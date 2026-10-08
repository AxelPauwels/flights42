import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabbedPane } from '@flights/shared/ui-common/injection-tabbed-pane/tabbed-pane';
import { Tab } from '@flights/shared/ui-common/injection-tabbed-pane/tab';

@Component({
  selector: 'app-about',
  imports: [
    TabbedPane,
    Tab
  ],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {}

export default About;
