import {
  AfterViewInit,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges,
  StaticProvider,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComponentToSwitch } from '../../models';

@Directive({
  selector: '[componentsToSwitch]',
  exportAs: 'switcher',
})
export class ComponentSwitcherDirective implements OnChanges, OnDestroy, AfterViewInit {
  private indexedDictionary: { [key: string]: number };
  private componentRefs: ComponentRef<any>[];
  private injectProviders: StaticProvider[] = [{ provide: ComponentSwitcherDirective, useValue: this }];
  private sharedContextCache: any = {};
  private sharedContextSubject$ = new BehaviorSubject<any>({});
  private usedComponentsToSwitch: ComponentToSwitch[];
  currentComponent: ComponentToSwitch;
  currentIndex: number;
  previousIndex: number;

  @Input()
  render = true;

  @Input()
  componentsToSwitch: ComponentToSwitch[];

  @Input()
  private sharedContext: any;

  sharedContext$: Observable<any> = this.sharedContextSubject$.asObservable();

  constructor(
    private cd: ChangeDetectorRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnDestroy(): void {
    this.componentRefs.forEach((componentRef) => {
      if (componentRef) {
        componentRef.destroy();
      }
    });
  }

  ngAfterViewInit(): void {
    this.switch(0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('sharedContext' in changes) {
      this.changeContext(this.sharedContext);
    }

    if ('componentsToSwitch' in changes) {
      if (this.componentsToSwitch) {
        this.usedComponentsToSwitch = this.componentsToSwitch;
        this.componentRefs = new Array(this.usedComponentsToSwitch.length);
        this.currentComponent = this.usedComponentsToSwitch[this.currentIndex];
        this.buildIndexedDictionary();
        this.switch(0);
      }
    }
  }

  changeContext(context: any): void {
    this.sharedContextCache = { ...context };
    this.sharedContextSubject$.next(this.sharedContextCache);
  }

  goNext(): void {
    if (this.currentIndex < this.usedComponentsToSwitch.length - 1) {
      this.switch(this.currentIndex + 1);
    } else {
      this.switch(0);
    }

    this.cd.detectChanges();
  }

  goPrevious(): void {
    if (this.currentIndex > 0) {
      this.switch(this.currentIndex - 1);
    } else {
      this.switch(this.usedComponentsToSwitch.length - 1);
    }

    this.cd.detectChanges();
  }

  goBack(): void {
    this.switch(this.previousIndex);
    this.cd.detectChanges();
  }

  goById(id: string): void {
    const goToIndex = this.indexedDictionary[id];
    this.switch(goToIndex);
    this.cd.detectChanges();
  }

  upsertAndSwitch(componentToSwitch: ComponentToSwitch): void {
    this.usedComponentsToSwitch.push(componentToSwitch);
    this.buildIndexedDictionary();
    this.switch(this.usedComponentsToSwitch.length - 1);
  }

  private switch(index: number): void {
    this.previousIndex = this.currentIndex;
    this.currentIndex = index;
    this.currentComponent = this.usedComponentsToSwitch[this.currentIndex];
    if (this.viewContainerRef.length) {
      this.viewContainerRef.detach(0);
    }

    this.viewContainerRef.insert(
      this.getOrCreateComponentRef(
        index,
        this.usedComponentsToSwitch[index].componentType,
        this.usedComponentsToSwitch[index].contextData
      ).hostView
    );
    this.cd.detectChanges();
  }

  private buildIndexedDictionary(): void {
    this.indexedDictionary = {};

    this.usedComponentsToSwitch.forEach((x, index) => (this.indexedDictionary[x.id] = index));
  }

  private getOrCreateComponentRef(
    index: number,
    compType: any,
    contextData: { [key: string]: any }
  ): ComponentRef<any> {
    const contextExists = contextData && Object.keys(contextData);
    if (this.componentRefs[index]) {
      return contextExists
        ? this.bindInputsToComponentRef(this.componentRefs[index], contextData)
        : this.componentRefs[index];
    }

    const injector = Injector.create({
      providers: [...this.injectProviders],
      parent: this.injector,
    });

    const cref = this.componentFactoryResolver.resolveComponentFactory(compType).create(injector);
    this.componentRefs[index] = contextExists ? this.bindInputsToComponentRef(cref, contextData) : cref;

    return this.componentRefs[index];
  }

  private bindInputsToComponentRef(
    cref: ComponentRef<unknown>,
    contextData: { [key: string]: any }
  ): ComponentRef<unknown> {
    Object.keys(contextData).forEach((key) => {
      cref.instance[key] = contextData[key];
    });
    this.passNgOnChangesIfImlemented(cref, contextData);
    cref.changeDetectorRef.detectChanges();
    return cref;
  }

  private passNgOnChangesIfImlemented(cref: ComponentRef<unknown>, contextData: { [key: string]: any }): void {
    const ngOnChangesFuncName = 'ngOnChanges';
    if (typeof cref.instance[ngOnChangesFuncName] === 'function') {
      const changes: SimpleChanges = {};
      Object.keys(contextData).forEach((key) => {
        changes[key] = new SimpleChange(null, contextData[key], true);
      });

      cref.instance[ngOnChangesFuncName](changes);
    }
  }
}
