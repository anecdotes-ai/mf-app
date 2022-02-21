import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Note } from '../../models/domain';
import { ResourceType } from 'core/modules/data/models';
import { removeWhitespaces } from 'core/utils';
import { NoteModalWindowService } from '../../services';
import { NoteFacadeService } from '../../services/facades';
import { ResourceData } from '../../models';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { RegularDateFormat } from 'core/constants/date';

@Component({
  selector: 'app-note-tooltip',
  templateUrl: './note-tooltip.component.html',
  styleUrls: ['./note-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteTooltipComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private resourceDataStream$: Observable<ResourceData>;

  @Input()
  resourceType: ResourceType;

  @Input()
  resourceId: string;

  @Input()
  source: string;

  isLoaded: boolean;
  resourceData: ResourceData;
  note: Note;
  dateFormat: string = RegularDateFormat;

  constructor(
    private noteModalWindowService: NoteModalWindowService,
    private noteFacade: NoteFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resourceDataStream$ = this.noteFacade
      .getResourceData(this.resourceType, this.resourceId)
      .pipe(this.detacher.takeUntilDetach());

    this.resourceDataStream$.subscribe((resourceData) => {
      this.resourceData = resourceData;
      this.cd.detectChanges();
    });

    this.resourceDataStream$
      .pipe(
        filter((data) => data.noteExists),
        switchMap(() => this.noteFacade.getNote(this.resourceType, this.resourceId)),
        this.detacher.takeUntilDetach()
      )
      .subscribe((note) => {
        this.note = note;
        this.isLoaded = true;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  removeWhiteSpacesFunc(str: string): string {
    return removeWhitespaces(str);
  }

  buildTranslationKey(relativeKey: string): string {
    return `noteElement.${relativeKey}`;
  }

  editRequirementNote(): void {
    this.noteModalWindowService.openEditNoteModal(this.resourceType, this.resourceId, this.resourceData, this.source);
  }

  removeRequirementNoteClick(): void {
    this.noteModalWindowService.openRemoveStateNoteModal(this.resourceType, this.resourceId, this.resourceData, this.source);
  }
}
