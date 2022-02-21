import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PluginFacadeService } from 'core/modules/data/services';
import { CalculatedRequirement } from 'core/modules/data/models';
import { Service, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { Observable } from 'rxjs';
import { ModalWindowService } from 'core/modules/modals';

@Component({
  selector: 'app-automate-plugin-button',
  templateUrl: './automate-plugin-button.component.html',
  styleUrls: ['./automate-plugin-button.component.scss'],
})
export class AutomatePluginButtonComponent implements OnInit {
  @ViewChild('automatePluginsTemplate', { static: true })
  private automatePluginsmodalTemplate: TemplateRef<any>;

  genericRelatedervices$: Observable<Service[]>;

  @Input()
  controlRequirement: CalculatedRequirement;

  @Input()
  disabled: boolean;

  constructor(private pluginsFacade: PluginFacadeService, private modalWindowService: ModalWindowService,) {}

  ngOnInit(): void {
    this.genericRelatedervices$ = this.pluginsFacade.getGenericServices(
      this.controlRequirement?.services_that_automates
    );
  }

  automatePlugins(): void {
    this.modalWindowService.open({ id: 'automate-plugins-modal', template: this.automatePluginsmodalTemplate });
  }

  getPluginsConnectedStatus(services: Service[]): boolean {
    return !services.some((s) => s.service_status !== ServiceStatusEnum.INSTALLED);
  }

  buildTranslationKey(relativeKey: string): string {
    return `requirements.${relativeKey}`;
  }
}
