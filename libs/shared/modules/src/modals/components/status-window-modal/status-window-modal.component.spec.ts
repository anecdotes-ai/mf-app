import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { CustomStatusModalButton } from './constants/status-window-modal.constants';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusWindowModalComponent } from './status-window-modal.component';
import { MessageBusService } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalWindowService } from 'core/modules/modals';
import { configureTestSuite } from 'ng-bullet';

describe('StatusWindowModalComponent', () => {
  configureTestSuite();

  let component: StatusWindowModalComponent;
  let fixture: ComponentFixture<StatusWindowModalComponent>;
  let modalWindowService: ModalWindowService;
  let switcher: ComponentSwitcherDirective;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [StatusWindowModalComponent],
      providers: [
        MessageBusService,
        { provide: ModalWindowService, useValue: {} },
        {
          provide: ComponentSwitcherDirective,
          useValue: {
            goById: () => {},
            goBack: () => {},
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusWindowModalComponent);
    component = fixture.componentInstance;
    modalWindowService = TestBed.inject(ModalWindowService);
    switcher = TestBed.inject(ComponentSwitcherDirective);

    modalWindowService.close = jasmine.createSpy('close');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close function', () => {
    it('should close modal', () => {
      // Act
      component.close();

      // Assert
      expect(modalWindowService.close).toHaveBeenCalled();
    });

    it('should emit closeClick event', () => {
      // Arrange
      spyOn(component.closeClick, 'emit');

      // Act
      component.close();

      // Assert
      expect(component.closeClick.emit).toHaveBeenCalled();
    });
  });

  describe('closeModalOnClick input is false', () => {
    it('should be true by default', () => {
      // Arrange
      // Act
      // Arrange
      expect(component.closeModalOnClick).toBeTrue();
    });

    it('should not close modal when call "close" method', () => {
      // Arrange
      component.closeModalOnClick = false;

      // Act
      component.close();

      // Assert
      expect(modalWindowService.close).not.toHaveBeenCalled();
    });
  });

  describe('#customButtonHandlerExecute', () => {
    it('should close modal window if nextModalId is not provided', () => {
      // Arrange
      const buttonToClick: CustomStatusModalButton = { id: 'mainBtn', translationKeyPart: 'keyPart' };

      // Act
      component.customButtonHandlerExecute(buttonToClick);

      // Arrange
      expect(modalWindowService.close).toHaveBeenCalled();
    });

    it('should switch to next modal if nextModalId property is setteled', () => {
      // Arrange
      switcher.goById = jasmine.createSpy('switcherGoById');
      const buttonToClick: CustomStatusModalButton = {
        id: 'mainBtn',
        translationKeyPart: 'keyPart',
        nextModalId: 'someId',
      };

      // Act
      component.customButtonHandlerExecute(buttonToClick);

      // Assert
      expect(switcher.goById).toHaveBeenCalled();
    });
  });
});
