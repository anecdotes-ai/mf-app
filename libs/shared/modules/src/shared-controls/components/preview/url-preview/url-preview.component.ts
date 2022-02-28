import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { evidencePreviewTranslationRoot } from '../evidence-tabular-preview/evidence-tabular-preview.component';
import { CombinedEvidenceInstance } from './../../../../data/models/domain/combinedEvidenceInstance';
import { EvidenceSourcesEnum } from '../../../models';
import { TipTypeEnum } from 'core/models';

@Component({
  selector: 'app-url-preview',
  templateUrl: './url-preview.component.html',
  styleUrls: ['./url-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlPreviewComponent implements AfterViewInit {
  evidenceSources = EvidenceSourcesEnum;

  @ViewChild('tipRef', { read: ElementRef }) tipElRef: ElementRef<HTMLElement>;

  @Input()
  eventSource: EvidenceSourcesEnum;

  @Input()
  rootEvidence: CombinedEvidenceInstance;

  @Input()
  headerDataToDisplay: string[];

  copySuccess = false;
  tipTypes = TipTypeEnum;

  @HostListener('click')
  checkTipHidden(): boolean {
    return !!this.tipElRef?.nativeElement.classList.contains('hidden');
  }

  constructor(private windowHelper: WindowHelperService, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.checkTipHidden();
    this.cd.detectChanges();
  }

  openLink(link: string): void {
    const resultLink = !link.startsWith('http') ? 'https://' + link : link;

    this.windowHelper.openUrlInNewTab(resultLink);
  }

  buildTranslationKey(relativeKey: string): string {
    return `${evidencePreviewTranslationRoot}.${relativeKey}`;
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link);

    this.copySuccess = true;

    setTimeout(() => {
      this.copySuccess = false;
      this.cd.detectChanges();
    }, 800);
  }
}
