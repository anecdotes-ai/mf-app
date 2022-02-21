import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives';
import { TextAreaComponent } from 'core/modules/form-controls';
import { ModalWindowService } from 'core/modules/modals';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, of } from 'rxjs';
import { Note } from '../../models/domain';
import { ResourceType } from 'core/modules/data/models';
import { NoteFacadeService } from '../../services/facades';
import { NoteModalData } from './../../services/note-modal-window/note-modal-data';
import { NoteModalWindowComponent } from './note-modal-window.component';
import { EvidenceSourcesEnum } from 'core/models/user-events/user-event-data.model';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';

class MockSwitcherDir {
  public constructor() {}

  public sharedContext$: BehaviorSubject<NoteModalData> = new BehaviorSubject<NoteModalData>(null);
}

describe('NoteModalWindowComponent', () => {
  configureTestSuite();
  let component: NoteModalWindowComponent;
  let fixture: ComponentFixture<NoteModalWindowComponent>;

  let noteFacadeMock: NoteFacadeService;
  let modalWindowServiceMock: ModalWindowService;
  let switcher: MockSwitcherDir;
  let fakeNote: Note;
  let generalEventService: GeneralEventService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteModalWindowComponent, TextAreaComponent],
      providers: [
        { provide: ModalWindowService, useValue: {} },
        {
          provide: ComponentSwitcherDirective,
          useClass: MockSwitcherDir,
        },
        { provide: NoteFacadeService, useValue: {} },
        { provide: GeneralEventService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteModalWindowComponent);
    noteFacadeMock = TestBed.inject(NoteFacadeService);
    modalWindowServiceMock = TestBed.inject(ModalWindowService);
    switcher = TestBed.inject(ComponentSwitcherDirective) as any;

    component = fixture.componentInstance;
    noteFacadeMock.getNote = jasmine.createSpy('getNote').and.callFake(() => of(fakeNote));
    noteFacadeMock.removeNote = jasmine.createSpy('removeNote');
    noteFacadeMock.addNoteAsync = jasmine.createSpy('addNoteAsync').and.callFake(() => Promise.resolve());
    noteFacadeMock.editNoteAsync = jasmine.createSpy('editNoteAsync').and.callFake(() => Promise.resolve());
    modalWindowServiceMock.close = jasmine.createSpy('close');
    generalEventService = TestBed.inject(GeneralEventService);
    generalEventService.trackAddNoteEvent = jasmine.createSpy('trackAddNoteEvent');
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('#onInit', () => {});

  describe('#Button handlers', () => {
    beforeEach(() => {
      switcher.sharedContext$.next({
        resource_type: ResourceType.Control,
        resource_id: '123',
        resource_title: 'fake',
        resource_category: 'some-category',
        source: EvidenceSourcesEnum.Controls,
        isEditMode: true,
        isRemoveState: false,
      });

      fakeNote = {
        note_text: 'Mock text',
        resource_type: ResourceType.Control,
        resource_id: '123',
      };
    });

    it('closeBtnClick handler should call close method of modal window service', async () => {
      // Arrange
      // Act
      await detectChanges();
      component.closeBtnClick();

      // Assert
      expect(modalWindowServiceMock.close).toHaveBeenCalled();
    });

    it('cancelDeleteBtnClick handler should set remove state to false', async () => {
      // Arrange
      // Act
      await detectChanges();
      component.isRemoveState = true;
      component.cancelDeleteBtnClick();

      // Assert
      expect(component.isRemoveState).toBeFalse();
    });

    it('deleteBtnClick handler should set remove state to true', async () => {
      // Arrange

      // Act
      await detectChanges();
      component.isRemoveState = false;
      component.deleteBtnClick();

      // Assert
      expect(component.isRemoveState).toBeTrue();
    });

    it('confirmDeleteBtnClick handler should call note facade remove note method and close modal', async () => {
      // Arrange
      // Act
      await detectChanges();
      component.isRemoveState = false;
      component.confirmDeleteBtnClick();

      // Assert
      expect(noteFacadeMock.removeNote).toHaveBeenCalledWith(fakeNote);
      expect(modalWindowServiceMock.close).toHaveBeenCalled();
    });
  });

  describe('closeAndSaveBtnClick method', () => {
    beforeEach(async () => {
      fakeNote = {
        resource_type: ResourceType.Control,
        resource_id: '123',
        note_text: 'fake-text',
      };
      await detectChanges();
    });

    it('should set loader to true and modal should be closed', async () => {
      // Arrange
      const resourceType = ResourceType.Control;
      component.saveBtnLoader$.next = jasmine.createSpy('next');

      // Act
      await component.closeAndSaveBtnClick();

      // Assert
      expect(component.saveBtnLoader$.next).toHaveBeenCalledWith(true);
      expect(generalEventService.trackAddNoteEvent).toHaveBeenCalledWith(
        component.source,
        resourceType,
        component.isEditMode,
        component.resourceTitle,
        component.resourceCategory
      );
      expect(modalWindowServiceMock.close).toHaveBeenCalled();
    });

    it('should call for editNoteAsync method in facade if is on edit mode', async () => {
      // Arrange
      const expectedNoteText = 'fakenotetext';
      component.formControl.setValue(expectedNoteText);

      // Act
      await detectChanges();
      await component.closeAndSaveBtnClick();

      // Assert
      expect(noteFacadeMock.editNoteAsync).toHaveBeenCalledWith({ ...fakeNote, note_text: expectedNoteText });
    });

    it('should call for addNoteAsync method in facade if is not on edit mode', async () => {
      // Arrange
      const expectedNoteText = 'fakenotetext';
      component.formControl.setValue(expectedNoteText);
      switcher.sharedContext$.next({
        resource_type: ResourceType.Control,
        resource_id: '123',
        resource_title: 'fake',
        resource_category: 'some-category',
        source: EvidenceSourcesEnum.Controls,
        isEditMode: false,
        isRemoveState: false,
      });

      // Act
      await detectChanges();
      await component.closeAndSaveBtnClick();

      // Assert
      expect(noteFacadeMock.addNoteAsync).toHaveBeenCalledWith({ ...fakeNote, note_text: expectedNoteText });
    });
  });
});
