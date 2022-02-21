import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { AmplitudeService } from 'core';

@Component({
  selector: 'app-platform-entry',
  templateUrl: './platform-remote-entry.component.html',
  styleUrls: ['./platform-remote-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformRemoteEntryComponent implements OnInit {
  // loaderManager and updatesService required services
  constructor(private ngbTooltipConfig: NgbTooltipConfig, private amplitudeService: AmplitudeService) {}

  ngOnInit(): void {
    this.ngbTooltipConfig.tooltipClass = 'default-tooltip';
    this.ngbTooltipConfig.placement = 'right';
    this.ngbTooltipConfig.triggers = 'hover';
    this.ngbTooltipConfig.autoClose = false;
    this.ngbTooltipConfig.container = 'body';
    this.amplitudeService.init();
  }
}
