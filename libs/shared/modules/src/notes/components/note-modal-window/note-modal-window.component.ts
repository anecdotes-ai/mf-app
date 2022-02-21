import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives';
import { ModalWindowService } from 'core/modules/modals';
import { SubscriptionDetacher } from 'core/utils';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Note } from '../../models/domain';
import { ResourceType } from 'core/modules/data/models';
import { NoteFacadeService } from '../../services/facades';
import { NoteModalData } from '../../services/note-modal-window/note-modal-data';
import { parseHTMLEntities } from 'core/utils/parse-HTML-entities.function';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';

@Component({
  selector: 'app-note-modal-window',
  templateUrl: './note-modal-window.component.html',
  styleUrls: ['./note-modal-window.component.scss'],
})
export class NoteModalWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private resourceType: ResourceType;
  private resourceId: string;
  private editableNote: Note;

  @ViewChild('noteTextFieldRef', { static: true })
  noteTextField: ElementRef<HTMLTextAreaElement>;

  resourceTitle: string;

  isEditMode: boolean;

  isRemoveState: boolean;

  formControl: FormControl;

  resourceCategory: string;

  source: string;

  saveBtnLoader$: Subject<boolean> = new Subject();

  constructor(
    private modalWindowService: ModalWindowService,
    private switcher: ComponentSwitcherDirective,
    private noteFacadeService: NoteFacadeService,
    private generalEventService: GeneralEventService
  ) {}

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  ngAfterViewInit(): void {
    // We need it to await for comonent rendering so then .focus() works
    setTimeout(() => this.noteTextField.nativeElement.focus(), 100);
  }

  async ngOnInit(): Promise<void> {
    this.formControl = this.createFormControl();
    this.switcher.sharedContext$.pipe(this.detacher.takeUntilDetach()).subscribe((ctx: NoteModalData) => {
      this.resourceType = ctx.resource_type;
      this.resourceId = ctx.resource_id;
      this.resourceTitle = ctx.resource_title;
      this.resourceCategory = ctx.resource_category;
      this.source = ctx.source;
      this.isEditMode = ctx.isEditMode;
      this.isRemoveState = ctx.isRemoveState;
    });

    if (this.isEditMode) {
      this.editableNote = await this.noteFacadeService
        .getNote(this.resourceType, this.resourceId)
        .pipe(take(1))
        .toPromise();
      this.formControl.setValue(parseHTMLEntities(this.editableNote.note_text));
    }
  }

  closeBtnClick(): void {
    this.modalWindowService.close();
  }

  cancelDeleteBtnClick(): void {
    this.isRemoveState = false;
  }

  deleteBtnClick(): void {
    this.isRemoveState = true;
  }

  confirmDeleteBtnClick(): void {
    this.saveBtnLoader$.next(true);
    this.noteFacadeService.removeNote({
      ...this.editableNote,
      resource_type: this.resourceType,
      resource_id: this.resourceId,
    });
    this.modalWindowService.close();
  }

  async closeAndSaveBtnClick(): Promise<void> {
    try {
      this.saveBtnLoader$.next(true);

      if (this.isEditMode) {
        await this.noteFacadeService.editNoteAsync({
          resource_type: this.resourceType,
          resource_id: this.resourceId,
          note_text: this.formControl.value,
        });

      } else {
        await this.noteFacadeService.addNoteAsync({
          resource_type: this.resourceType,
          resource_id: this.resourceId,
          note_text: this.formControl.value,
        });
      }
      this.generalEventService.trackAddNoteEvent(
        this.source,
        this.resourceType,
        this.isEditMode,
        this.resourceTitle,
        this.resourceCategory
      );

      this.modalWindowService.close();
    } catch {
      this.saveBtnLoader$.next(false);
    }
  }

  buildTranslationKey(key: string): string {
    return `requirementNoteModal.${key}`;
  }

  private createFormControl(): FormControl {
    return new FormControl(null, [Validators.required]);
  }
}
