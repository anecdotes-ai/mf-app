import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';
import { ResourceType } from 'core/modules/data/models';

@Component({
  selector: 'app-evidence-copy-name',
  templateUrl: './evidence-copy-name.component.html',
  styleUrls: ['./evidence-copy-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceCopyNameComponent implements OnInit {
  private copiedTooltipTextKey = 'copyNameCopiedText';
  initialTooltipTextKey = 'copyNameInitialText';
  currentTooltipText: string;
  animationActive = false;

  @Input()
  entityName: string;

  @Input()
  source: string;

  type = ResourceType.Evidence;

  constructor(private cd: ChangeDetectorRef, private generalEventService: GeneralEventService) {}

  ngOnInit(): void {
    this.currentTooltipText = this.buildTranslationKey(this.initialTooltipTextKey);
  }

  copyEntityName(): void {
    navigator.clipboard.writeText(this.entityName);
    this.currentTooltipText = this.buildTranslationKey(this.copiedTooltipTextKey);
    this.animationActive = true;
    setTimeout(() => {
      this.animationActive = false;
      this.cd.detectChanges();
    }, 1000);
    this.generalEventService.trackCopyNameEvent(this.type, this.source);
  }

  buildTranslationKey(key: string): string {
    return `evidences.evidenceLabel.${key}`;
  }

  setInitialText(): void {
    this.currentTooltipText = this.buildTranslationKey(this.initialTooltipTextKey);
  }
}
