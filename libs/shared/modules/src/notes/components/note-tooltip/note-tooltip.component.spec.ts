import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteModalWindowService } from '../../services';
import { NoteTooltipComponent } from './note-tooltip.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { LinkifyPipe, LocalDatePipe } from 'core/modules/pipes';
import { NoteFacadeService } from '../../services/facades';
import { of } from 'rxjs';
import { ResourceData } from '../../models';
import { Note } from '../../models/domain';
import { ResourceType } from 'core/modules/data/models';
import { configureTestSuite } from 'ng-bullet';
import { EvidenceSourcesEnum } from 'core/models/user-events/user-event-data.model';

describe('NoteTooltipComponent', () => {
  configureTestSuite();

  let componentUnderTest: NoteTooltipComponent;
  let fixture: ComponentFixture<NoteTooltipComponent>;

  let noteWindowService: NoteModalWindowService;
  let noteFacade: NoteFacadeService;

  let fakeNote: Note;
  let fakeResourceData: ResourceData;
  const source = EvidenceSourcesEnum.Controls;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteTooltipComponent, LinkifyPipe, LocalDatePipe],
      providers: [
        { provide: NoteModalWindowService, useValue: {} },
        { provide: NoteFacadeService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteTooltipComponent);
    noteWindowService = TestBed.inject(NoteModalWindowService);
    noteFacade = TestBed.inject(NoteFacadeService);
    componentUnderTest = fixture.componentInstance;

    noteWindowService.openEditNoteModal = jasmine.createSpy('openEditNoteModal');
    noteWindowService.openRemoveStateNoteModal = jasmine.createSpy('openRemoveStateNoteModal');
    noteFacade.getNote = jasmine.createSpy('getNote').and.callFake(() => of(fakeNote));
    noteFacade.getResourceData = jasmine.createSpy('getResourceTitle').and.callFake(() => of(fakeResourceData));
    componentUnderTest.resourceType = ResourceType.Control;
    componentUnderTest.resourceId = 'fakeResourceId';
    componentUnderTest.source = source;
    fakeNote = {
      note_text: 'Mock text',
      note_updated_by: 'fake_author'
    };
    fakeResourceData = {
      title: 'fakeTitle',
      noteExists: true,
    };
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = componentUnderTest.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`noteElement.${relativeKey}`);
    });
  });

  describe('note buttons interaction', () => {
    beforeEach(() => {
      componentUnderTest.note = { note_text: 'text', note_updated_by: 'someone' };
    });

    it('should call openEditNoteModal method of note window service when edit button has been clicked', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const editNoteEl = fixture.debugElement.query(By.css('.edit-note')).nativeElement;
      editNoteEl.dispatchEvent(new MouseEvent('click'));

      // Assert
      expect(noteWindowService.openEditNoteModal).toHaveBeenCalledWith(
        componentUnderTest.resourceType,
        componentUnderTest.resourceId,
        fakeResourceData,
        source
      );
    });

    it('should call openRemoveStateNoteModal method of note window service when edit button has been clicked', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      await fixture.whenRenderingDone();

      const editNoteEl = fixture.debugElement.query(By.css('.remove')).nativeElement;
      editNoteEl.dispatchEvent(new MouseEvent('click'));

      // Assert
      expect(noteWindowService.openRemoveStateNoteModal).toHaveBeenCalledWith(
        componentUnderTest.resourceType,
        componentUnderTest.resourceId,
        fakeResourceData,
        source
      );
    });
  });
});
