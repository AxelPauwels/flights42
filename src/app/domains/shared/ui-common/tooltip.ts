import {
  afterRenderEffect,
  DestroyRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

// if you assign the name $implicit, the property will hold a “default” value
// that can be used without knowing the actual property name.
interface TooltipContext {
  $implicit: string;
  text: string;
}

@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseover)': 'setHidden(false)',
    '(mouseout)': 'setHidden(true)',
  },
})
export class Tooltip {
  //The host’s container
  private readonly viewContainer = inject(ViewContainerRef);
  private viewRef: EmbeddedViewRef<TooltipContext> | undefined;
  //The host’s reference
  private host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly template = input<TemplateRef<TooltipContext> | undefined>(undefined, {
    alias: 'appTooltip',
  });

  constructor() {
    afterRenderEffect(() => {
      const template = this.template();
      if (!template) {
        return;
      }
      this.initTooltip(template);
    });

    this.destroyRef.onDestroy(() => {
      this.removeTooltip();
    });
  }

  private removeTooltip() {
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = undefined;
    }
  }

  initTooltip(template: TemplateRef<TooltipContext>): void {
    if (this.viewRef) {
      this.viewRef.destroy();
    }

    // Using its createEmbeddedView method, we add the template to the container.
    // This can be seen as code-based content projection.
    // You can call createEmbeddedView multiple times to get several instances of the template.
    this.viewRef = this.viewContainer.createEmbeddedView(
      template,
      {
      $implicit: 'Tooltip!',
      text: 'Important Information!',
    });

    this.viewRef?.rootNodes.forEach((nativeElement) => {
      nativeElement.className = 'tooltip';
      nativeElement.hidden = true;
    });
  }

  setHidden(hidden: boolean): void {
    this.viewRef?.rootNodes.forEach((nativeElement) => {
      if (!hidden) {
        this.updatePosition(nativeElement);
      }
      nativeElement.hidden = hidden;
    });
  }

  private updatePosition(toolTipElement: HTMLElement) {
    const r = this.host.nativeElement.getBoundingClientRect();
    toolTipElement.style.left = `${r.left + r.width / 2}px`;
    toolTipElement.style.top = `${r.top - 8}px`;
    toolTipElement.style.transform = 'translate(-50%, -100%)';
  }
}
