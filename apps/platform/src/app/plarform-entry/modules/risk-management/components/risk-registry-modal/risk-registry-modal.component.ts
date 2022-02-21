import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResidualRiskLevelEnum } from 'core/modules/risk/models';
import { FileDownloadingHelperService } from 'core/services';
import { RiskLevelBGClasses } from '../../constants';

const RISK_REGISTRY_FILE_PATH = 'assets/img/riskRegistry.png';
const RISK_REGISTRY_FILE_NAME = 'risk-registry';

@Component({
  selector: 'app-risk-registry-modal',
  templateUrl: './risk-registry-modal.component.html',
  styleUrls: ['./risk-registry-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskRegistryModal {
  @Input()
  riskName: string;

  @Input()
  riskLevel: ResidualRiskLevelEnum;

  get riskLevelBackgroundClass(): string {
    return RiskLevelBGClasses[this.riskLevel];
  }

  constructor(private fileDownloadingHelperService: FileDownloadingHelperService) {}

  downloadRegistry(): void {
    this.fileDownloadingHelperService.downloadFileByUrl(RISK_REGISTRY_FILE_PATH, RISK_REGISTRY_FILE_NAME);
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskAanlysis.${relativeKey}`;
  }
}
