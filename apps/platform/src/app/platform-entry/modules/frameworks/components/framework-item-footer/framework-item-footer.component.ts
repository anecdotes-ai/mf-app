import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FrameworkStatus } from 'core/modules/data/models';
import { AppRoutes } from 'core/constants';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { AccountFeatureEnum, Framework } from 'core/modules/data/models/domain';
import { FrameworksFacadeService, FrameworksEventService } from 'core/modules/data/services';
import { ModalWindowService } from 'core/modules/modals';
import { CreateFrameworkModalComponent } from '../';

@Component({
  selector: 'app-framework-item-footer',
  templateUrl: './framework-item-footer.component.html',
  styleUrls: ['./framework-item-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkItemFooterComponent {
  @HostBinding('class')
  private readonly classes = 'flex flex-column';

  @Input()
  framework: Framework;
  @Input()
  isAuditInProgress: boolean;

  readonly visibleForRoles: string[] = [RoleEnum.Admin, RoleEnum.Collaborator];
  isApplicabilityChangeInProgress: boolean;
  featuresEnum = AccountFeatureEnum;

  get isNew(): boolean {
    return this.framework.framework_status === FrameworkStatus.NEW;
  }

  constructor(
    private frameworkFacade: FrameworksFacadeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    public frameworkFacadeService: FrameworksFacadeService,
    private frameworksEventService: FrameworksEventService,
    private modalWindowService: ModalWindowService
  ) {}

  // TODO: Replace with navigator
  exploreFramework(event: MouseEvent): void {
    event.stopPropagation();
    this.frameworksEventService.trackFrameworkOverviewClick(this.framework.framework_name, (event.target as HTMLButtonElement)?.innerText);

    this.router.navigate([`${AppRoutes.Frameworks}/${this.framework.framework_name}`]);
  }

  async adoptFrameworkAsync(): Promise<void> {
    try {
      this.isApplicabilityChangeInProgress = true;
      this.cd.detectChanges();

      await this.frameworkFacade.adoptFrameworkAsync(this.framework);
    } finally {
      this.isApplicabilityChangeInProgress = false;
      this.cd.detectChanges();
    }
  }

  createFramework(): void {
    this.frameworksEventService.trackCreateFrameworkClick();
    this.modalWindowService.openInSwitcher({
      componentsToSwitch: [
        {
          id: 'create-framework-modal',
          componentType: CreateFrameworkModalComponent,
        },
      ],
    });
  }

  buildTranslationKey(relativeKey: string): string {
    return `frameworks.${relativeKey}`;
  }
}
