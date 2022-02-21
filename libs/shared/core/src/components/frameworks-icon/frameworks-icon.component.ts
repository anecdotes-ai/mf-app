import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlRelatedFramework } from 'core/modules/data/models';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { createSortCallback } from 'core/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Framework } from 'core/modules/data/models/domain';

export const enum TemplateTypesEnum {
  default = 'default',
  controls = 'inControlsPage',
  evidencePool = 'inEvidencePool',
}

export const TemplateTypes = {
  default: TemplateTypesEnum.default,
  controls: TemplateTypesEnum.controls,
  evidencePool: TemplateTypesEnum.evidencePool,
};

export const FrameworksEnum = {
  ITGC: 'ITGC (Beta)',
  PCI: 'PCI-DSS v3.2.1',
  SOC2: 'SOC 2',
};

@Component({
  selector: 'app-frameworks-icon',
  templateUrl: './frameworks-icon.component.html',
  styleUrls: ['./frameworks-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrameworksIconComponent implements OnInit, OnChanges {
  private relatedFrameworks$ = new BehaviorSubject<{ [frameworkName: string]: string[] }>({});
  private tscTranslationKey = 'controls.tscPillTitleForSoc';

  @Input() relatedFrameworks: { [frameworkName: string]: string[] } = {};

  @Input()
  tooltipTemplateType: TemplateTypesEnum = TemplateTypesEnum.default;

  @Input()
  shouldDisplayIfNoControls = false;

  templateTypes = TemplateTypes;
  applicableRelatedFrameworks$: Observable<ControlRelatedFramework[]>;

  constructor(private frameworksFacade: FrameworksFacadeService, private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('relatedFrameworks' in changes) {
      this.relatedFrameworks$.next(changes['relatedFrameworks'].currentValue);
    }
  }

  ngOnInit(): void {
    this.applicableRelatedFrameworks$ = this.relatedFrameworks$.pipe(
      switchMap(() => {
        return this.frameworksFacade.getApplicableFrameworks().pipe(
          map((frameworks) => this.filterRelatedFrameworks(frameworks)),
          map((frameworks) => this.sortFrameworks(frameworks))
        );
      })
    );
  }

  joinControlNames(controlNames: string[]): string {
    return (
      controlNames
        // We take only the first peice of the control name
        .map((controlName) => controlName.split(' ')[0])
        .sort(createSortCallback((controlName) => controlName.toLocaleLowerCase()))
        .join('\n')
    );
  }

  resolveFrameworkName(frameworkName: string): string {
    switch (frameworkName) {
      case FrameworksEnum.PCI:
        return Object.keys(FrameworksEnum).find((key) => FrameworksEnum[key] === frameworkName);
      case FrameworksEnum.ITGC:
        return Object.keys(FrameworksEnum).find((key) => FrameworksEnum[key] === frameworkName);
      case FrameworksEnum.SOC2:
        return this.translateService.instant(this.tscTranslationKey);
      default:
        return frameworkName;
    }
  }

  isFrameworkNameSoc(frameworkName: string): boolean {
    return frameworkName === FrameworksEnum.SOC2;
  }

  trackByFramework(_: number, framework: ControlRelatedFramework): string {
    return framework.framework_name;
  }

  private sortFrameworks(frameworks: ControlRelatedFramework[]): ControlRelatedFramework[] {
    return frameworks.sort((a, b) => a.framework_name.localeCompare(b.framework_name));
  }

  private filterRelatedFrameworks(frameworks: Framework[]): ControlRelatedFramework[] {
    return Object.keys(this.relatedFrameworks)
      .filter((relatedFramework) => frameworks.some((framework) => relatedFramework === framework.framework_name))
      .map((frameworkName) => {
        return { framework_name: frameworkName, respective_controls: this.relatedFrameworks[frameworkName] };
      });
  }
}
