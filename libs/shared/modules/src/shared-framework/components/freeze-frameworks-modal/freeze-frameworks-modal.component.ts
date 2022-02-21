import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DynamicFormGroup } from 'core/modules/dynamic-form';
import { Framework } from 'core/modules/data/models/domain';
import { ToggleBoxControl } from 'core/models';
import { GlobalLoaderModalWindowSharedContext, GlobalLoaderModalWindowSharedContextInputKeys, ModalWindowService } from 'core/modules/modals';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives';
import { FrozenItemModalEnum } from '../../constants';
import { take } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-freeze-frameworks-modal',
  templateUrl: './freeze-frameworks-modal.component.html',
  styleUrls: ['./freeze-frameworks-modal.component.scss']
})
export class FreezeFrameworksModalComponent implements OnInit {

  frameworksList: Framework[] = [];
  form: DynamicFormGroup<any> = new DynamicFormGroup({});
  initFrameworkState: {[key: string]: boolean} = {};

  get hasApplicableFrameworks(): boolean {
    return !!(this.frameworksList && this.frameworksList.length);
  }

  get isDirty(): boolean {
    return !!Object.keys(this.initFrameworkState).find(frameworkId => this.initFrameworkState[frameworkId] !== this.form.controls[frameworkId].value);
  }

  constructor(
    private frameworksFacade: FrameworksFacadeService,
    private modalWindowService: ModalWindowService,
    private switcher: ComponentSwitcherDirective,
    private cd: ChangeDetectorRef
    ) { }

  async ngOnInit(): Promise<void> {
    this.frameworksList = cloneDeep(await this.frameworksFacade.getApplicableFrameworks().pipe(take(1)).toPromise());
    this.frameworksList.forEach((framework) => {
      const control = new ToggleBoxControl({
        initialInputs: {
          title: framework.framework_name,
          iconSrc: `frameworks/${(framework.framework_icon_id ?? framework.framework_id)}`,
          validateOnDirty: true,
        },
      });
      this.initFrameworkState[framework.framework_id] = framework.freeze;
      control.setValue(framework.freeze);
      this.form.addControl(framework.framework_id, control);
    });
    this.cd.detectChanges();
  }

  buildTranslationKey(key: string): string {
    return `frameworks.freeze-modal.${key}`;
  }

  async updateFreezeFramework(): Promise<void> {
    this.frameworksList = this.frameworksList.filter((framework) => {
      framework.freeze = this.form.controls[framework.framework_id].value;
      return this.initFrameworkState[framework.framework_id] !== this.form.controls[framework.framework_id].value;
    });
    this.switcher.changeContext({
      [GlobalLoaderModalWindowSharedContextInputKeys.loadingHandlerFunction]:
      () => this.frameworksFacade.changeBatchFrameworkFreezeData(this.frameworksList),
    } as GlobalLoaderModalWindowSharedContext);
    this.switcher.goById(FrozenItemModalEnum.Loader);
  }

  dismiss(): void {
    this.modalWindowService.close();
  }
}
