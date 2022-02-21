import { Injectable } from '@angular/core';
import { ModalWindowWithSwitcher } from 'core/models/modal-window.model';
import { ModalWindowService } from 'core/modules/modals';
import { NoteModalWindowComponent } from '../../components/note-modal-window/note-modal-window.component';
import { ResourceType } from 'core/modules/data/models';
import { ResourceData } from 'core/modules/notes/models';
import { NoteModalData } from './note-modal-data';

@Injectable()
export class NoteModalWindowService {
  constructor(private modalWindowService: ModalWindowService) {}

  openAddNoteModal(resource_type: ResourceType, resource_id: string, resourceData: ResourceData, source: string): void {
    this.resolveOpenNoteModal(resource_type, resource_id, resourceData.title, resourceData.category, source);
  }

  openEditNoteModal(resource_type: ResourceType, resource_id: string, resourceData: ResourceData, source: string): void {
    this.resolveOpenNoteModal(resource_type, resource_id, resourceData.title,resourceData.category, source, true);
  }

  openRemoveStateNoteModal(resource_type: ResourceType, resource_id: string, resourceData: ResourceData, source: string): void {
    this.resolveOpenNoteModal(resource_type, resource_id, resourceData.title,resourceData.category,source, true, true);
  }

  private resolveOpenNoteModal(
    resource_type: ResourceType,
    resource_id: string,
    resource_title: string,
    resource_category: string,
    source: string,
    isEditMode?: boolean,
    isRemoveState?: boolean
  ): void {
    const modalWindowSwitcher: ModalWindowWithSwitcher<NoteModalData> = {
      id: `requirement-note-modal`,
      componentsToSwitch: [
        {
          id: `add-or-edit-note`,
          componentType: NoteModalWindowComponent,
        },
      ],
      context: {
        resource_type,
        resource_id,
        resource_title,
        resource_category,
        source,
        isEditMode,
        isRemoveState,
      },
      options: { closeBtnDisplay: false, displayBackground: false },
    };

    this.modalWindowService.openInSwitcher(modalWindowSwitcher);
  }
}
