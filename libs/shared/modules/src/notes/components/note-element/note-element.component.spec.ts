import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceData } from '../../models';
import { NgVarDirective } from 'core/modules/directives';
import { ControlRequirement } from 'core/modules/data/models/domain';
import { LinkifyPipe } from 'core/modules/pipes';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { ResourceType } from 'core/modules/data/models';
import { Note } from '../../models/domain';
import { NoteFacadeService } from '../../services/facades';
import { NoteModalWindowService } from '../../services/note-modal-window/note-modal-window.service';
import { NoteElementComponent } from './note-element.component';
import { EvidenceSourcesEnum } from 'core/models/user-events/user-event-data.model';

describe('NoteElementComponent', () => {
  configureTestSuite();
  let componentUnderTest: NoteElementComponent;
  let fixture: ComponentFixture<NoteElementComponent>;

  let noteFacade: NoteFacadeService;
  let noteWindowService: NoteModalWindowService;
  let fakeNote: Note;
  let fakeResourceData: ResourceData;
  const source = EvidenceSourcesEnum.Controls;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteElementComponent, LinkifyPipe, NgVarDirective],
      providers: [
        {
          provide: NoteFacadeService,
          useValue: {},
        },
        { provide: NoteModalWindowService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot(), NgbTooltipModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteElementComponent);
    noteFacade = TestBed.inject(NoteFacadeService);
    noteWindowService = TestBed.inject(NoteModalWindowService);
    componentUnderTest = fixture.componentInstance;

    noteWindowService.openAddNoteModal = jasmine.createSpy('openAddNoteModal');
    noteWindowService.openEditNoteModal = jasmine.createSpy('openEditNoteModal');
    noteFacade.getNote = jasmine.createSpy('getNote').and.callFake(() => of(fakeNote));
    noteFacade.getResourceData = jasmine.createSpy('getResourceTitle').and.callFake(() => of(fakeResourceData));
    componentUnderTest.resourceType = ResourceType.Control;
    componentUnderTest.resourceId = 'fakeResourceId';
    componentUnderTest.source = source;
    fakeNote = {
      note_text: 'Mock text',
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
    // Act
    fixture.detectChanges();

    // Assert
    expect(componentUnderTest).toBeTruthy();
  });

  describe('note button interactions', () => {
    let mockRequirement: ControlRequirement;

    beforeEach(() => {
      mockRequirement = {
        requirement_id: 'someId',
        requirement_note_exists: true,
      };
    });

    it('should call openAddNoteModal method of Note Window Service when empty note icon clicked', async () => {
      // Arrange
      fakeNote = null;
      fakeResourceData.noteExists = false;

      // Act
      await detectChanges();

      const emptyIcon = fixture.debugElement.query(By.css('.empty-note'));
      emptyIcon.triggerEventHandler('click', {});

      // Assert
      expect(noteWindowService.openAddNoteModal).toHaveBeenCalledWith(
        componentUnderTest.resourceType,
        componentUnderTest.resourceId,
        fakeResourceData,
        source
      );
    });

    it('should call openEditNoteModal method of Note Window Service when note icon clicked for existing note', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      const icon = fixture.debugElement.query(By.css('.existed-note-icon'));
      icon.triggerEventHandler('click', {});

      // Assert
      expect(noteWindowService.openEditNoteModal).toHaveBeenCalledWith(
        componentUnderTest.resourceType,
        componentUnderTest.resourceId,
        fakeResourceData,
        source
      );
    });
  });

  describe('when host clicked', () => {
    it('should stop propagation in event', () => {
      // Arrange
      const mouseEvent = new MouseEvent('click');
      spyOn(mouseEvent, 'stopPropagation');
      // Act
      fixture.debugElement.triggerEventHandler('click', mouseEvent);

      // Assert
      expect(mouseEvent.stopPropagation).toHaveBeenCalled();
    });
  });
});
