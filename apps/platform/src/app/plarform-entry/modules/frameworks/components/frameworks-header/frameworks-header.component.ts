import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RoleService } from 'core/modules/auth-core/services';
import { DataSearchComponent, SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { NewFramework } from 'core/modules/data/constants';
import { Framework } from 'core/modules/data/models/domain';
import { FrameworkModalService } from 'core/modules/shared-framework/services';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { FrameworkContentService } from '../../services';

@Component({
  selector: 'app-frameworks-header',
  templateUrl: './frameworks-header.component.html',
  styleUrls: ['./frameworks-header.component.scss'],
})
export class FrameworksHeaderComponent implements OnInit {
  private detacher = new SubscriptionDetacher();

  @ViewChild(DataSearchComponent)
  private searchComponent: DataSearchComponent;

  @Output()
  modifiedDataList = new EventEmitter<Framework[]>();

  applicableModifiedList: Framework[];
  notApplicableModifiedList: Framework[];
  isFrameworksSeparated: boolean;
  applicableFrameworks: Framework[];

  searchDefinitions: SearchDefinitionModel<Framework>[] = [
    {
      propertySelector: (c) => c.framework_name,
    },
  ];

  filteredCount: number;

  frameworksStream$: Observable<Framework[]>;
  isAuditor: boolean;

  constructor(
    private cd: ChangeDetectorRef,
    private frameworksContent: FrameworkContentService,
    private frameworkModalService: FrameworkModalService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.frameworksStream$ = this.frameworksContent.getDisplayedFrameworks();
    this.roleService
      .isAuditor()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((isAuditor) => (this.isAuditor = isAuditor));
  }

  setFoundFrameworks(foundFrameworks: Framework[]): void {
    this.filteredCount = foundFrameworks.length;
    this.modifiedDataList.emit(foundFrameworks);

    this.applicableModifiedList = foundFrameworks.filter((framework) => framework.is_applicable);
    this.notApplicableModifiedList = foundFrameworks.filter(
      (framework) => !framework.is_applicable && framework.framework_id !== NewFramework.framework_id
    );
    this.isFrameworksSeparated =
      foundFrameworks.some((framework) => framework.is_applicable) &&
      foundFrameworks.some((framework) => !framework.is_applicable);
    this.cd.detectChanges();
  }

  buildTranslationKey(key: string): string {
    return `frameworks.header.${key}`;
  }

  resetAllFilters(): void {
    this.searchComponent.reset();
    this.cd.detectChanges();
  }

  async openFrozenConfig(): Promise<void> {
    await this.frameworkModalService.openFrozenFrameworksModal();
  }
}
