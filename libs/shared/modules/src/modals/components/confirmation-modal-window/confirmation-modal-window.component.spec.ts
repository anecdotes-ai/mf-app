/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalWindowComponent } from './confirmation-modal-window.component';
import { ModalWindowService } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { ConfirmationModalWindowSharedContext, ConfirmationModalWindowSharedContextInputKeys } from 'core/modules/modals';

describe('ConfirmationModalWindowComponent with switcher', () => {
  configureTestSuite();
  let componentUnderTest: ConfirmationModalWindowComponent;
  let fixture: ComponentFixture<ConfirmationModalWindowComponent>;
  let switcherMock: ComponentSwitcherDirective;
  let modalWindowService: ModalWindowService;
  let fakeContext: ConfirmationModalWindowSharedContext;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationModalWindowComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalWindowService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalWindowComponent);
    componentUnderTest = fixture.componentInstance;
    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.close = jasmine.createSpy('close');
    switcherMock.sharedContext$ = of({ fakeContext });
    switcherMock.goById = jasmine.createSpy('goById');
    componentUnderTest.confirmationHandlerFunction = jasmine.createSpy('confirmationHandlerFunction');
    fakeContext = {
      [ConfirmationModalWindowSharedContextInputKeys.confirmTranslationKey]: 'string',
      [ConfirmationModalWindowSharedContextInputKeys.dismissTranslationKey]: 'string',
      [ConfirmationModalWindowSharedContextInputKeys.questionTranslationKey]: 'string',
      [ConfirmationModalWindowSharedContextInputKeys.questionTranslationParams]: 'any',
      [ConfirmationModalWindowSharedContextInputKeys.aftermathTranslationKey]: 'string',
      [ConfirmationModalWindowSharedContextInputKeys.aftermathTemplate]: null,
      [ConfirmationModalWindowSharedContextInputKeys.icon]: 'string',
      [ConfirmationModalWindowSharedContextInputKeys.confirmationHandlerFunction]: () => { },
      translationKey: 'fakeTransKey'
    };
    componentUnderTest.errorWindowSwitcherId = 'errorId';
    componentUnderTest.successWindowSwitcherId = 'successId';
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call getSwitcherContextData if used with switcher', async () => {
      // Arrange
      const spy = spyOn<any>(componentUnderTest, 'getSwitcherContextData');

      // Act
      await detectChanges();

      // Assert
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('confirm()', () => {
    it('should call confirmationHandlerFunction when used with switcher ', async () => {
      // Act
      await detectChanges();
      componentUnderTest.confirm();

      // Assert
      expect(componentUnderTest.confirmationHandlerFunction).toHaveBeenCalled();
    });

    it('should call switcher.goById with success window id when used with switcher and confirm action done succesfully', async () => {
      // Arrange
      componentUnderTest.confirmationHandlerFunction = jasmine.createSpy('confirmationHandlerFunction').and.resolveTo('success');
      switcherMock.goById = jasmine.createSpy('goById');

      // Act
      await detectChanges();
      await componentUnderTest.confirm();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(componentUnderTest.successWindowSwitcherId);
    });

    it('should call switcher.goById with error window id when used with switcher and confirm action done with error', async () => {
      // Arrange
      componentUnderTest.confirmationHandlerFunction = jasmine.createSpy('confirmationHandlerFunction').and.rejectWith('error');
      switcherMock.goById = jasmine.createSpy('goById');

      // Act
      await detectChanges();
      await componentUnderTest.confirm();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(componentUnderTest.errorWindowSwitcherId);
    });

    it('should have emit confirm click when confirm', async () => {
      // Arrange
      componentUnderTest.confirmClick.emit = jasmine.createSpy('emit');

      // Act
      await detectChanges();
      await componentUnderTest.confirm();

      // Assert
      expect(componentUnderTest.confirmClick.emit).toHaveBeenCalled();
    });
  });
});

describe('ConfirmationModalWindowComponent without switcher', () => {
  configureTestSuite();
  let componentUnderTest: ConfirmationModalWindowComponent;
  let fixture: ComponentFixture<ConfirmationModalWindowComponent>;
  let modalWindowService: ModalWindowService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationModalWindowComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalWindowService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalWindowComponent);
    componentUnderTest = fixture.componentInstance;
    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.close = jasmine.createSpy('close');
    componentUnderTest.confirmationHandlerFunction = jasmine.createSpy('confirmationHandlerFunction');
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should not call getSwitcherContextData if used without switcher', async () => {
      // Arrange
      const spy = spyOn<any>(componentUnderTest, 'getSwitcherContextData');

      // Act
      await detectChanges();

      // Assert
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('confirm()', () => {
    it('should call close when no contextData used without switcher', async () => {
      // Arrange

      // Act
      await detectChanges();
      componentUnderTest.confirm();

      // Assert
      expect(modalWindowService.close).toHaveBeenCalled();
    });

    it('should have emit confirm click when confirm', async () => {
      // Arrange
      componentUnderTest.confirmClick.emit = jasmine.createSpy('emit');

      // Act
      await detectChanges();
      await componentUnderTest.confirm();

      // Assert
      expect(componentUnderTest.confirmClick.emit).toHaveBeenCalled();
    });
  });
});
