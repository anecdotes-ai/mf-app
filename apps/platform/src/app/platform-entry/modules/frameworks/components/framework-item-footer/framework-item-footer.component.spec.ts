import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ModalWindowService } from 'core/modules/modals';
import { FrameworksFacadeService, FrameworksEventService } from 'core/modules/data/services';
import { FrameworkItemFooterComponent } from './framework-item-footer.component';
import { configureTestSuite } from 'ng-bullet';
import { CreateFrameworkModalComponent } from 'core/modules/shared-framework';
import { By } from '@angular/platform-browser';
import { FrameworkStatus } from 'core/modules/data/models';
import { TranslateModule } from '@ngx-translate/core';

describe('FrameworkItemFooterComponent', () => {
  configureTestSuite();
  let component: FrameworkItemFooterComponent;
  let fixture: ComponentFixture<FrameworkItemFooterComponent>;
  let modalWindowService: ModalWindowService;
  let eventService: FrameworksEventService;

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FrameworkItemFooterComponent],
      providers: [
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: FrameworksEventService, useValue: {} },
        { provide: ModalWindowService, useValue: {} }
      ],
      imports: [ TranslateModule.forRoot() ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkItemFooterComponent);
    component = fixture.componentInstance;
    component.framework = { framework_id: 'fake-id'};

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');

    eventService = TestBed.inject(FrameworksEventService);
    eventService.trackCreateFrameworkClick = jasmine.createSpy('trackCreateFrameworkClick');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`frameworks.${relativeKey}`);
    });
  });

  describe('#createFramework', () => {
    it('should open create framework modal', () => {
      // Act
      component.createFramework();

      // Assert
      expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith({
        componentsToSwitch: [
          {
            id: 'create-framework-modal',
            componentType: CreateFrameworkModalComponent,
          },
        ],
      });
    });

    it('should send amplitude event to track framework create', () => {
      // Act
      component.createFramework();

      // Assert
      expect(eventService.trackCreateFrameworkClick).toHaveBeenCalled();
    });
  });

  describe('#buttons rendering', () => {
    it('should render create-framework-btn if framework status is new', () => {
      // Arrange
      component.framework.framework_status = FrameworkStatus.NEW;

      // Act
      fixture.detectChanges();
      fixture.whenStable();

      const btn = fixture.debugElement.query(By.css('#create-framework-btn'));

      // Assert
      expect(btn).toBeTruthy();
    });

    it('should render explore-frameworks-btn if framework is applicable and not in audit', () => {
      // Arrange
      component.framework.is_applicable = true;

      // Act
      fixture.detectChanges();
      fixture.whenStable();

      const btn = fixture.debugElement.query(By.css('#explore-frameworks-btn'));

      // Assert
      expect(btn).toBeTruthy();
    });

    it('should render audit-btn if framework is applicable and in audit', () => {
      // Arrange
      component.framework.is_applicable = true;
      component.isAuditInProgress = true;
      
      // Act
      fixture.detectChanges();
      fixture.whenStable();

      const btn = fixture.debugElement.query(By.css('#audit-btn'));

      // Assert
      expect(btn).toBeTruthy();
    });
  });
});
