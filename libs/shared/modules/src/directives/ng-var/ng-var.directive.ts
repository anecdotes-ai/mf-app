import { Directive, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngVar]',
})
export class NgVarDirective implements OnInit, OnChanges {
  private templateContext: any = {};

  @Input()
  ngVar: any;

  constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('ngVar' in changes) {
      if (this.templateContext.ngVar !== this.ngVar) {
        this.templateContext.$implicit = this.templateContext.ngVar = this.ngVar;
      }
    }
  }

  ngOnInit(): void {
    this.vcRef.createEmbeddedView(this.templateRef, this.templateContext);
  }
}
