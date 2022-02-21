import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderManagerService } from 'core/services/loader-manager/loader-manager.service';
import { FrameworksFacadeService } from 'core/modules/data/services/facades';
import { UserProviderService } from 'core/services/auth/user-provider/user-provider.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomePageComponent } from './welcome-page.component';
import { Component, ViewChild } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

@Component({
  template: `
    <app-welcome-page></app-welcome-page>    
  `,
})
class WrapperComponent {
  @ViewChild(WelcomePageComponent, { static: true }) appComponentRef: WelcomePageComponent;
}

//TODO : fix this test
xdescribe('WelcomePageComponent', () => {
  configureTestSuite();
  let component: WelcomePageComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let loaderManagerService: LoaderManagerService;
  let frameworksFacadeService: FrameworksFacadeService;
  let userProvidedService: UserProviderService;
  let componentSwitcherDirective : ComponentSwitcherDirective;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [WelcomePageComponent, WrapperComponent, ComponentSwitcherDirective],
      providers: [
        { provide: LoaderManagerService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: UserProviderService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} },
      ],
    }).compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    const wrapperComponent = fixture.componentInstance;
    component = wrapperComponent.appComponentRef;
    loaderManagerService = TestBed.inject(LoaderManagerService);
    frameworksFacadeService = TestBed.inject(FrameworksFacadeService);
    userProvidedService = TestBed.inject(UserProviderService);
    componentSwitcherDirective = TestBed.inject(ComponentSwitcherDirective);    
    fixture.detectChanges();
  });

  it('should create', async() => {
    await detectChanges();

    expect(component).toBeTruthy();
  });

});
