/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PluginFacadeService } from 'core/modules/data/services';

import { AutomatePluginButtonComponent } from './automate-plugin-button.component';
import { ModalWindowService } from 'core/modules/modals';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Service } from 'core/modules/data/models/domain';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

describe('AutomatePluginButtonComponent', () => {
  let component: AutomatePluginButtonComponent;
  let fixture: ComponentFixture<AutomatePluginButtonComponent>;

  let pluginsFacade: PluginFacadeService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AutomatePluginButtonComponent],
        imports: [TranslateModule.forRoot(), NgbTooltipModule],
        providers: [
          { provide: PluginFacadeService, useValue: {} },
          { provide: ModalWindowService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatePluginButtonComponent);
    component = fixture.componentInstance;
    pluginsFacade = TestBed.inject(PluginFacadeService);
    pluginsFacade.getGenericServices = jasmine.createSpy('getGenericServices').and.returnValue(of([]));
  });

  function expectNoRelevantPluginsBtn(debugElement: DebugElement): void {
    const btn = debugElement.query(By.css('#noRelevantPluginsBtn'));
    expect(btn).toBeTruthy();
    expect(btn.classes['no-relevant-plugins']).toBeTruthy();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Automation buttons()', () => {
    const someGenericPlugins: Service[] = [
      {
        service_id: 'test1',
        service_display_name: 'Test1',
        service_type: 'GENERIC',
      },
      {
        service_id: 'test2',
        service_display_name: 'Test2',
        service_type: 'GENERIC',
      },
    ];

    beforeEach(() => {
      component.controlRequirement = {
        requirement_applicability: true,
        requirement_related_evidences: [],
      };
      pluginsFacade.getGenericServices = jasmine
        .createSpy('getGenericServices')
        .and.returnValue(of(someGenericPlugins));
    });

    it('Automate plugins button should be rendered when requirement_applicability is true and some generic related plugins exists', async () => {
      // Arrange
      spyOn(component, 'getPluginsConnectedStatus').and.returnValue(false);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const btn = fixture.debugElement.query(By.css('#automatePluginBtn'));
      expect(btn).toBeTruthy();
      expect(btn.classes['plugins-automated']).toBeFalsy();
    });

    it('Plugins automated should be rendered when requirement_applicability is true and some generic related plugins are installed', async () => {
      // Arrange
      spyOn(component, 'getPluginsConnectedStatus').and.returnValue(true);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const btn = fixture.debugElement.query(By.css('#automatePluginBtn'));
      expect(btn).toBeTruthy();
      expect(btn.classes['plugins-automated']).toBeTruthy();
    });

    it('should render no relevant plugins button when no related plugins exist', async () => {
      // Arrange
      pluginsFacade.getGenericServices = jasmine.createSpy('getGenericServices').and.returnValue(of(null));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expectNoRelevantPluginsBtn(fixture.debugElement);
    });

    it('should render no relevant plugins button when no related plugins exist if list is empty', async () => {
      // Arrange
      pluginsFacade.getGenericServices = jasmine.createSpy('getGenericServices').and.returnValue(of([]));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expectNoRelevantPluginsBtn(fixture.debugElement);
    });
  });
});
