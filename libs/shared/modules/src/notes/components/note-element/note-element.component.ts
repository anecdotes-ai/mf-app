import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { ResourceData } from '../../models';
import { ResourceType } from 'core/modules/data/models';
import { NoteModalWindowService } from '../../services';
import { NoteFacadeService } from '../../services/facades';

@Component({
  selector: 'app-note-element',
  templateUrl: './note-element.component.html',
  styleUrls: ['./note-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteElementComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();

  @Input()
  resourceType: ResourceType;

  @Input()
  resourceId: string;

  resourceData: ResourceData;

  @Input()
  policyType: string;

  @Input()
  source: string;

  constructor(
    private noteFacade: NoteFacadeService,
    private noteModalWindowService: NoteModalWindowService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.noteFacade
      .getResourceData(this.resourceType, this.resourceId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((resourceData) => {
        this.resourceData = resourceData;
        if (this.resourceType === ResourceType.Policy) {
          this.resourceData.category = this.policyType;
        }
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  addRequirementNote(): void {
    this.noteModalWindowService.openAddNoteModal(this.resourceType, this.resourceId, this.resourceData, this.source);
  }

  editRequirementNote(): void {
    this.noteModalWindowService.openEditNoteModal(this.resourceType, this.resourceId, this.resourceData, this.source);
  }

  buildTranslationKey(relativeKey: string): string {
    return `noteElement.${relativeKey}`;
  }

  @HostListener('click', ['$event'])
  private onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
