import { TestBed } from '@angular/core/testing';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { NoteModalWindowComponent } from '../../components/note-modal-window/note-modal-window.component';
import { ResourceType } from 'core/modules/data/models';
import { ModalWindowService } from 'core/modules/modals';
import { NoteModalData } from './note-modal-data';
import { NoteModalWindowService } from './note-modal-window.service';
import { ResourceData } from 'core/modules/notes/models';
import { EvidenceSourcesEnum } from 'core';

class MockModalWindowService {
  public constructor() {}

  openInSwitcher(modal: ModalWindowWithSwitcher): void {}
}

describe('NoteModalWindowService', () => {
  let service: NoteModalWindowService;
  let modalWindowService: MockModalWindowService;
  const fakeResourceType = ResourceType.Policy;
  const fakeResourceId = 'fake_resource_id';
  const fakeResourceData: ResourceData = {
    title: 'fake_resource_title',
    category: undefined,
    noteExists: false
  };

  const source = EvidenceSourcesEnum.Controls;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteModalWindowService, { provide: ModalWindowService, useClass: MockModalWindowService }],
    });
    modalWindowService = TestBed.inject(ModalWindowService);

    service = TestBed.inject(NoteModalWindowService);

    spyOn(modalWindowService, 'openInSwitcher');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openAddNoteModal', () => {
    it('should open NoteModalWindowComponent as a modal with controlRequirement in shared context and global options setted', () => {
      // Arrange
      const expectedResultObj = getModalEntityToOpen();

      // Act
      service.openAddNoteModal(fakeResourceType, fakeResourceId, fakeResourceData, source);

      // Assert
      expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith(expectedResultObj);
    });
  });

  describe('openEditNoteModal', () => {
    it('should open NoteModalWindowComponent as a modal with controlRequirement in shared context and  global options setted', () => {
      // Arrange
      const expectedResultObj = getModalEntityToOpen(true);

      // Act
      service.openEditNoteModal(fakeResourceType, fakeResourceId, fakeResourceData, source);

      // Assert
      expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith(expectedResultObj);
    });
  });

  describe('openRemoveStateNoteModal', () => {
    it('should open NoteModalWindowComponent as a modal with controlRequirement in shared context and  global options set', () => {
      // Arrange
      const expectedResultObj = getModalEntityToOpen(true, true);

      // Act
      service.openRemoveStateNoteModal(fakeResourceType, fakeResourceId, fakeResourceData, source);

      // Assert
      expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith(expectedResultObj);
    });
  });

  function getModalEntityToOpen(isEditMode?: boolean, isRemoveState?: boolean): ModalWindowWithSwitcher<NoteModalData> {
    return {
      id: `requirement-note-modal`,
      componentsToSwitch: [
        {
          id: `add-or-edit-note`,
          componentType: NoteModalWindowComponent,
        },
      ],
      context: {
        resource_type: fakeResourceType,
        resource_id: fakeResourceId,
        resource_title: fakeResourceData.title,
        resource_category: fakeResourceData.category,
        source: source,
        isEditMode,
        isRemoveState,
      },
      options: { closeBtnDisplay: false, displayBackground: false },
    };
  }
});
