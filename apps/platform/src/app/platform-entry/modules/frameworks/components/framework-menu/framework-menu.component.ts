import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FrameworkStatus } from 'core/modules/data/models';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { MenuAction } from 'core/modules/dropdown-menu';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { FrameworksPluginsModalService } from 'core/modules/shared-controls/modules/frameworks-plugins/services/frameworks-plugins-modal/frameworks-plugins-modal.service';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { Framework } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-framework-menu',
  templateUrl: './framework-menu.component.html',
  styleUrls: ['./framework-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkMenuComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private abandonIsInProgress: boolean;
  private framework: Framework;

  @Input()
  currentUserRole: RoleEnum;
  @Input()
  frameworkId: string;
  @Input()
  isAuditInProgress: boolean;
  threeDotsMenu: MenuAction[] = [
    {
      translationKey: this.buildTranslationKey('menu.plugins'),
      displayCondition: () => this.framework?.is_applicable && this.doesCurrentUsersRoleCanModifyPlugins(),
      disabledCondition: () => this.abandonIsInProgress,
      action: () => this.callFrameworksPluginsModal(),
    },
    {
      translationKey: this.buildTranslationKey('menu.abandon'),
      displayCondition: () => this.framework?.is_applicable,
      disabledCondition: () => this.abandonIsInProgress,
      action: this.abandonFrameworkAsync.bind(this),
    },
  ];

  @Output()
  actionStarted = new EventEmitter(true);

  @Output()
  actionFinished = new EventEmitter(true);

  constructor(
    private frameworkFacade: FrameworksFacadeService,
    private frameworksPluginsModalService: FrameworksPluginsModalService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.frameworkFacade
      .getFrameworkById(this.frameworkId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((framework) => {
        this.framework = framework;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  isFrameworkAvailable(): boolean {
    return this.framework?.framework_status === FrameworkStatus.AVAILABLE;
  }

  buildTranslationKey(relativeKey: string): string {
    return `frameworks.${relativeKey}`;
  }

  private callFrameworksPluginsModal(): void {
    this.frameworksPluginsModalService.openFrameworksPluginsList(this.frameworkId);
  }

  private doesCurrentUsersRoleCanModifyPlugins(): boolean {
    return this.currentUserRole === RoleEnum.Admin || this.currentUserRole === RoleEnum.Collaborator;
  }

  private async abandonFrameworkAsync(): Promise<void> {
    this.abandonIsInProgress = true;
    this.actionStarted.emit();
    this.cd.detectChanges();

    try {
      await this.frameworkFacade.abandonFrameworkAsync(this.framework);
    } finally {
      this.actionFinished.emit();
      this.abandonIsInProgress = false;
      this.cd.detectChanges();
    }
  }
}
