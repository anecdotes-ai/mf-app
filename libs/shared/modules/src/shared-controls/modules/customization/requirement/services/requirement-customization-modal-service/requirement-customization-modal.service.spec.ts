import { TestBed } from '@angular/core/testing';
import { StatusWindowModalComponent, StatusModalWindowInputKeys, StatusType, ModalWindowService } from 'core/modules/modals';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { Control, Framework } from 'core/modules/data/models/domain';
import { RequirementCreationModalComponent, SelectFromExistingComponent } from '../../components';
import {
  RequirementEditModalComponent,
  translationRootKey,
} from './../../components/requirement-edit-modal/requirement-edit-modal.component';
import { AddRequirementModalEnum, EditRequirementModalEnum } from '../../models';
import { RequirementCustomizationModalService } from './requirement-customization-modal.service';
import { RequirementCreationSharedContext } from './requirement-creation-shared-context';
import { RequirementEditSharedContext } from './requirement-edit-shared-context';
import { RequirementsFacadeService } from 'core/modules/data/services';


class MockModalWindowService {
  public constructor() { }
  openInSwitcher(modal: ModalWindowWithSwitcher): void { }
}

describe('RequirementCustomizationModalService', () => {
  let service: RequirementCustomizationModalService;

  let modalService: MockModalWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequirementCustomizationModalService,
        { provide: ModalWindowService, useClass: MockModalWindowService },
        { provide: RequirementsFacadeService, useValue: {} },
      ],
    });
    service = TestBed.inject(RequirementCustomizationModalService);
    modalService = TestBed.inject(ModalWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openAddRequirementModal()', () => {
    const fakeFramework: Framework = {};
    const fakeControl: Control = {};
    let openInSwitcherSpy: jasmine.Spy;

    beforeEach(() => {
      openInSwitcherSpy = jasmine.createSpy('openInSwitcher');
      modalService.openInSwitcher = openInSwitcherSpy;
      service.openAddRequirementModal(fakeControl.control_id, fakeFramework.framework_id);
    });

    function getModalArg(): ModalWindowWithSwitcher<RequirementCreationSharedContext> {
      return openInSwitcherSpy.calls.first().args[0];
    }

    it('should call modal window openInSwitcher one time', () => {
      // Arrange
      // Act
      // Assert
      expect(openInSwitcherSpy).toHaveBeenCalledTimes(1);
    });

    it('should call modalwindow.open with 4 componentsToSwitch', () => {
      // Arrange
      // Act
      // Assert
      expect(getModalArg().componentsToSwitch.length).toBe(4);
    });

    it('should have SelectFromExistingComponent as the first element for componentsToSwitch', () => {
      // Arrange
      // Act
      // Assert
      expect(getModalArg().componentsToSwitch[0]).toEqual({
        id: AddRequirementModalEnum.SelectExisting,
        componentType: SelectFromExistingComponent,
      });
    });

    it('should have RequirementCreationModalComponent as the second element for componentsToSwitch', () => {
      // Arrange
      // Act
      // Assert
      expect(getModalArg().componentsToSwitch[1]).toEqual({
        id: AddRequirementModalEnum.AddNew,
        componentType: RequirementCreationModalComponent,
      });
    });

    it('should have StatusWindowModalComponent with contextData as the third element for componentsToSwitch', () => {
      // Arrange
      // Act
      // Assert
      expect(getModalArg().componentsToSwitch[2]).toEqual({
        id: AddRequirementModalEnum.Success,
        componentType: StatusWindowModalComponent,
        contextData: {
          [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
          [StatusModalWindowInputKeys.closeModalOnClick]: true,
        },
      });
    });

    it('should have StatusWindowModalComponent with contextData as the fourth element for componentsToSwitch', () => {
      // Arrange
      // Act
      // Assert
      expect(getModalArg().componentsToSwitch[3]).toEqual({
        id: AddRequirementModalEnum.Error,
        componentType: StatusWindowModalComponent,
        contextData: {
          [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
          [StatusModalWindowInputKeys.closeModalOnClick]: false,
        },
      });
    });

    it('should have options', () => {
      // Arrange
      // Act
      // Assert
      expect(getModalArg().options).toEqual({
        closeOnBackgroundClick: false,
      });
    });

    it('should have contex', () => {
      // Arrange
      // Act
      // Assert
      expect(getModalArg().context).toEqual({
        control_id: fakeControl.control_id,
        framework_id: fakeFramework.framework_id,
        translationKey: 'requirements.addRequirementModal'
      });
    });
  });

  describe('openEditRequirementModal', () => {
    const testDataToPass: RequirementEditSharedContext = {
      control: { control_id: 'test_control_id' },
      requirement: { requirement_id: 'test_req_id' },
      framework: { framework_id: 'frame_id' },
      translationKey: `${translationRootKey}.statusModal`,
    };

    function getOpenInSwitcherMethodArguments(): ModalWindowWithSwitcher<RequirementEditSharedContext> {
      const funcAsJasmineSpy = modalService.openInSwitcher as jasmine.Spy<(modal: ModalWindowWithSwitcher) => void>;
      return funcAsJasmineSpy.calls.mostRecent().args[0] as ModalWindowWithSwitcher<RequirementEditSharedContext>;
    }

    beforeEach(() => {
      modalService.openInSwitcher = jasmine.createSpy('openInSwitcher', modalService.openInSwitcher);
    });

    it('should call openInSwitcher method of modalService with 3 modals', () => {
      // Arrange
      // Act
      service.openEditRequirementModal(testDataToPass.control, testDataToPass.requirement, testDataToPass.framework);

      // Assert
      const argumentsPassed = getOpenInSwitcherMethodArguments();
      expect(argumentsPassed.componentsToSwitch.length).toEqual(3);
    });

    it('opened switcher modals should have RequirementEditModalComponent type modal', () => {
      // Arrange
      // Act
      service.openEditRequirementModal(testDataToPass.control, testDataToPass.requirement, testDataToPass.framework);

      // Assert
      const argumentsPassed = getOpenInSwitcherMethodArguments();

      const mainModal = argumentsPassed.componentsToSwitch.find((c) => c.id === EditRequirementModalEnum.MainModal);
      expect(mainModal.componentType).toBe(RequirementEditModalComponent);
    });

    it('opened switcher modals should have Success status modal with specific contextData', () => {
      // Arrange
      // Act
      service.openEditRequirementModal(testDataToPass.control, testDataToPass.requirement, testDataToPass.framework);

      // Assert
      const argumentsPassed = getOpenInSwitcherMethodArguments();

      const successModal = argumentsPassed.componentsToSwitch.find(
        (c) => c.id === EditRequirementModalEnum.SuccessModal
      );
      expect(successModal.componentType).toBe(StatusWindowModalComponent);
      expect(successModal.contextData).toEqual({
        [StatusModalWindowInputKeys.statusType]: StatusType.SUCCESS,
        [StatusModalWindowInputKeys.closeModalOnClick]: true,
      });
    });

    it('opened switcher modals should have Error status modal with specific contextData', () => {
      // Arrange
      // Act
      service.openEditRequirementModal(testDataToPass.control, testDataToPass.requirement, testDataToPass.framework);

      // Assert
      const argumentsPassed = getOpenInSwitcherMethodArguments();

      const errorModal = argumentsPassed.componentsToSwitch.find((c) => c.id === EditRequirementModalEnum.ErrorModal);
      expect(errorModal.componentType).toBe(StatusWindowModalComponent);
      expect(errorModal.contextData).toEqual({
        [StatusModalWindowInputKeys.statusType]: StatusType.ERROR,
        [StatusModalWindowInputKeys.closeModalOnClick]: false,
      });
    });

    it('shared switcher context should be settled', () => {
      // Arrange
      // Act
      service.openEditRequirementModal(testDataToPass.control, testDataToPass.requirement, testDataToPass.framework);

      // Assert
      const argumentsPassed = getOpenInSwitcherMethodArguments();

      const sharedContext = argumentsPassed.context;
      expect(sharedContext).toEqual({
        control: testDataToPass.control,
        requirement: testDataToPass.requirement,
        framework: testDataToPass.framework,
        translationKey: testDataToPass.translationKey,
      });
    });
  });
});
