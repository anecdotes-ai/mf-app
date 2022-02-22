import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnapshotsFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { take } from 'rxjs/operators';
import { LoaderManagerService } from 'core';

@Component({
  selector: 'app-audit-controls',
  templateUrl: './audit-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditControlsComponent implements OnInit {

  currentFramework: Framework;
  snapshotFramework: Framework;
  controls: CalculatedControl[];
  private frameworkName: string;
  private snapshotId: string;

  constructor(
    private route: ActivatedRoute,
    private snapshotsFacadeService: SnapshotsFacadeService,
    private cd: ChangeDetectorRef,
    private loaderManager: LoaderManagerService,
    private frameworkFacade: FrameworksFacadeService) { }

  async ngOnInit(): Promise<void> {
    this.loaderManager.show();
    this.frameworkName = this.route.snapshot.paramMap.get('framework');
    this.snapshotId = this.route.snapshot.paramMap.get('snapshot');
    await this.loadInitData();
  }

  async loadInitData(): Promise<void> {
    this.currentFramework = await this.frameworkFacade.getFrameworkByName(this.frameworkName).pipe(take(1)).toPromise();
    this.cd.detectChanges();
    this.snapshotFramework = await this.snapshotsFacadeService.getFramewrokSnapshot(this.snapshotId).pipe(take(1)).toPromise();
    this.loaderManager.hide();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.loaderManager.hide();
  }
}
