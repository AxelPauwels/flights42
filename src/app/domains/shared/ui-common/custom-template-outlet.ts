import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appCustomTemplateOutlet]',
})
export class CustomTemplateOutlet<T extends object> {
  readonly template = input<TemplateRef<unknown> | undefined>(undefined, {
    alias: 'appCustomTemplateOutlet',
  });
  readonly context = input<T>(undefined, {
    alias: 'appCustomTemplateOutletContext',
  });

  private readonly viewContainer = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const tmpl = this.template();
      const ctx = this.context();

      if (!tmpl) {
        return;
      }

      this.viewContainer.clear();
      const viewRef = this.viewContainer.createEmbeddedView(tmpl, ctx);

      const rootNodes = viewRef.rootNodes;
      // Contains all root elements of the template. In the case:
      // <div *appTableField="let data; provide: 'id'; title: 'Flight Id'">{{data}}</div>
      // that will be that 1 div.
      // In case of using not the syntax sugar, like:
      // <ng-template>
      //   <div>First root element</div>
      //   <div>Second root element</div>
      // </ng-template>
      // There will be 2 root elements, the first and second divs.
    });
  }
}
