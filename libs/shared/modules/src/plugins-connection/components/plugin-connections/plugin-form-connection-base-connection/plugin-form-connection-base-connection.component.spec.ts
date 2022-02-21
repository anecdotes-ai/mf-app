// import { AgentStatus, AgentDnsStatus } from './../../../../data/models/domain/agentStatus';
// import { TextFieldControl } from 'core/models/form/text-field-control';
// import { PluginConnectionEntity } from './../../../store/models/state-entity.model';
// import { ComponentSwitcherDirective } from './../../../../component-switcher/directives/component-switcher/component-switcher.directive';
// import { PluginConnectionStaticStateSharedContext } from './../../../models/plugin-static-content.model';
// import { DynamicFormGroup } from 'core/modules/dynamic-form';
// import { Agent, Service, ServiceLog, ServiceStatusEnum } from 'core/modules/data/models/domain';
// /* tslint:disable:no-unused-variable */
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { TranslateModule } from '@ngx-translate/core';
// import { PluginConnectionFacadeService, PluginConnectionFormBuilderService } from '../../../services';
// import {
//   FormModes,
//   OnPremFields,
//   PluginFormConnectionBaseComponent,
// } from './plugin-form-connection-base-connection.component';
// import { UserEventDirective } from 'core/modules/directives';
// import { UserEventService } from 'core/services';
// import { PluginFacadeService } from 'core/modules/data/services';
// import { configureTestSuite } from 'ng-bullet';
// import { of, Subject } from 'rxjs';
// import { UserEvents } from 'core';
// import { PluginsEventService } from 'core/modules/plugins-connection/services/plugins-event-service/plugins-event.service';
// import { SimpleChanges } from '@angular/core';
// import { AgentsFacadeService } from 'core/modules/data/services/facades/agent-facade/agents-facade.service';
// import { OnPremFieldsEnum } from 'core/modules/plugins-connection/models/on-prem-fields.enum';
// import { Router } from '@angular/router';

// class MockSwitcherDir {
//   public sharedContext$ = new Subject<PluginConnectionStaticStateSharedContext>();

//   goById = jasmine.createSpy('goById');
// }
// describe('PluginFormBaseConnectionComponent', () => {
//   configureTestSuite();

//   let component: PluginFormConnectionBaseComponent;
//   let fixture: ComponentFixture<PluginFormConnectionBaseComponent>;

//   let pluginFacade: PluginFacadeService;
//   let formBuilder: PluginConnectionFormBuilderService;
//   let pluginEventService: PluginsEventService;
//   let pluginConnectionFacade: PluginConnectionFacadeService;
//   let agentsFacade: AgentsFacadeService;

//   let pluginConnectionentity: PluginConnectionEntity;
//   let builtMockFormGroup: DynamicFormGroup<any>;

//   let service: Service = {
//     service_id: 'fake_service_id',
//     service_display_name: 'some-service',
//     service_evidence_list: [{}, {}],
//     service_fields: [
//       { field_name: 'first', param_type: 'TEXT' },
//       { field_name: 'second', param_type: 'TEXT' },
//     ],
//   };

//   const agents: Agent[] = [
//     {
//       id: 'some-id', name: 'some-name', api_key: 'some-key', tunnels: [], status: {
//       }
//     },
//     {
//       id: 'some-id', name: 'some-name', api_key: 'some-key', tunnels: [], status: {
//       }
//     },
//   ];

//   const changedField: { [key: string]: any } = {};

//   const onPremFields: OnPremFields = {
//     [OnPremFieldsEnum.AgentID]: agents[0].id,
//     [OnPremFieldsEnum.Hostname]: 'some-hostname',
//     [OnPremFieldsEnum.Port]: '80',
//   };

//   beforeAll(async(() => {
//     TestBed.configureTestingModule({
//       imports: [TranslateModule.forRoot()],
//       declarations: [PluginFormConnectionBaseComponent, UserEventDirective],
//       providers: [
//         { provide: Router, useValue: {} },
//         { provide: PluginConnectionFormBuilderService, useValue: {} },
//         { provide: UserEventService, useValue: {} },
//         { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
//         { provide: PluginFacadeService, useValue: {} },
//         { provide: PluginConnectionFacadeService, useValue: {} },
//         { provide: UserEventService, useValue: {} },
//         { provide: AgentsFacadeService, useValue: {} },
//         { provide: PluginsEventService, useValue: {} },
//       ],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PluginFormConnectionBaseComponent);

//     pluginFacade = TestBed.inject(PluginFacadeService);
//     pluginFacade.getLogsOrderedByDate = jasmine.createSpy('getLogsOrderedByDate');

//     formBuilder = TestBed.inject(PluginConnectionFormBuilderService);
//     formBuilder.buildDynamicFormGroup = jasmine.createSpy('buildDynamicFormGroup');

//     pluginEventService = TestBed.inject(PluginsEventService);
//     pluginEventService.trackConnectPluginClick = jasmine.createSpy('trackConnectPluginClick');
//     pluginEventService.trackReconnectPluginClick = jasmine.createSpy('trackReconnectPluginClick');
//     pluginEventService.trackEditPluginClick = jasmine.createSpy('trackEditPluginClick');
//     pluginEventService.trackCancelEditPluginClick = jasmine.createSpy('trackCancelEditPluginClick');

//     pluginConnectionFacade = TestBed.inject(PluginConnectionFacadeService);
//     pluginConnectionFacade.saveConnectionFormValuesIfPossible = jasmine.createSpy('saveConnectionFormValuesIfPossible');
//     pluginConnectionFacade.getPluginConnectionEntity = jasmine.createSpy('getPluginConnectionEntity');
//     agentsFacade = TestBed.inject(AgentsFacadeService);
//     agentsFacade.getAgents = jasmine.createSpy('getAgents').and.returnValue(of(agents));

//     component = fixture.componentInstance;

//     // Assign default values
//     pluginConnectionentity = {
//       service_id: service.service_id,
//       connection_state: null,
//       connection_form_values: service.service_fields,
//       evidence_successfully_collected: 0,
//     };

//     builtMockFormGroup = new DynamicFormGroup<any>({
//       first: new TextFieldControl({}),
//     });
//   });

//   async function detectChanges(): Promise<void> {
//     fixture.detectChanges();
//     await fixture.whenStable();
//   }

//   async function detectChangesWithDefaultValues(serviceIncome: Service = service): Promise<void> {
//     component.service = serviceIncome;

//     await detectChanges();

//     const serviceChanges: SimpleChanges = {
//       service: { firstChange: true, currentValue: serviceIncome, previousValue: null, isFirstChange: () => true },
//     };

//     await component.ngOnChanges(serviceChanges);
//   }

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('Life cicle hooks', () => {
//     describe('onChanges', () => {
//       beforeEach(() => {
//         (formBuilder.buildDynamicFormGroup as jasmine.Spy<jasmine.Func>).and.returnValue(builtMockFormGroup);
//         (pluginFacade.getLogsOrderedByDate as jasmine.Spy<jasmine.Func>).and.returnValue(
//           of([{ message: 'Fake log' } as ServiceLog])
//         );
//         (pluginConnectionFacade.getPluginConnectionEntity as jasmine.Spy<jasmine.Func>).and.returnValue(
//           of(pluginConnectionentity)
//         );
//       });

//       it('should create dynamic form and subscribe for logs if is first service change income', async () => {
//         // Arrange
//         // Act
//         await detectChangesWithDefaultValues();

//         // Assert
//         expect(pluginFacade.getLogsOrderedByDate).toHaveBeenCalledWith(service.service_id, null, 'dsc');
//         expect(formBuilder.buildDynamicFormGroup).toHaveBeenCalledWith(
//           service.service_fields,
//           pluginConnectionentity.connection_form_values,
//           {
//             password_show_hide_button: true,
//           }
//         );
//       });

//       it(`should resolve form mode to ${FormModes.EDITABLE} when service is on status ${ServiceStatusEnum.INSTALLED}`, async () => {
//         // Arrange
//         const removedService = { ...service, service_status: ServiceStatusEnum.INSTALLED };

//         // Act
//         await detectChangesWithDefaultValues(removedService);

//         // Assert
//         expect(component.mode).toEqual(FormModes.EDITABLE);
//         expect(component.dynamicFormGroup.disabled).toBeTrue();
//       });

//       Object.values(ServiceStatusEnum)
//         .filter((status) => status !== ServiceStatusEnum.INSTALLED)
//         .forEach((statusNotInstalled) => {
//           it(`should resolve form mode to ${FormModes.INITIAL} when service is on status ${statusNotInstalled}`, async () => {
//             // Arrange
//             const removedService: Service = { ...service, service_status: ServiceStatusEnum.REMOVED };
//             component.service = removedService;
//             await detectChanges();

//             const serviceChanges: SimpleChanges = {
//               service: {
//                 firstChange: true,
//                 currentValue: removedService,
//                 previousValue: null,
//                 isFirstChange: () => true,
//               },
//             };

//             // Act
//             await component.ngOnChanges(serviceChanges);

//             // Assert
//             expect(component.mode).toEqual(FormModes.INITIAL);
//             expect(component.dynamicFormGroup.disabled).toBeFalse();
//           });
//         });
//     });
//   });

//   describe('Amplitude events sending', () => {
//     beforeEach(async () => {
//       (formBuilder.buildDynamicFormGroup as jasmine.Spy<jasmine.Func>).and.returnValue(builtMockFormGroup);
//       (pluginFacade.getLogsOrderedByDate as jasmine.Spy<jasmine.Func>).and.returnValue(
//         of([{ message: 'Fake log' } as ServiceLog])
//       );
//       (pluginConnectionFacade.getPluginConnectionEntity as jasmine.Spy<jasmine.Func>).and.returnValue(
//         of(pluginConnectionentity)
//       );

//       await detectChangesWithDefaultValues();
//     });

//     it(`should call pluginEventService.trackConnectPluginClick() event when resolveGenericInstallationProcess() called`, async () => {
//       // Arrange
//       // Act
//       component.resolveGenericInstallationProcess();

//       // Assert
//       expect(pluginEventService.trackConnectPluginClick).toHaveBeenCalledWith(service);
//     });

//     it(`should call pluginEventService.trackReconnectPluginClick event when resolveReconnectProcess() called`, async () => {
//       // Arrange
//       // Act
//       component.resolveReconnectProcess();

//       // Assert
//       expect(pluginEventService.trackReconnectPluginClick).toHaveBeenCalledWith(service, changedField);
//     });

//     it(`should call pluginEventService.trackEditPluginClick event when editForm() called`, async () => {
//       // Arrange
//       // Act
//       component.editForm();

//       // Assert
//       expect(pluginEventService.trackEditPluginClick).toHaveBeenCalledWith(service);
//     });

//     it(`should send ${UserEvents.PLUGIN_CANCEL_EDIT_FORM} event when editForm() called`, () => {
//       // Arrange
//       // Act
//       component.cancelEditForm();

//       // Assert
//       expect(pluginEventService.trackCancelEditPluginClick).toHaveBeenCalledWith(service);
//     });
//   });

//   describe('On-Prem flow', () => {
//     beforeEach(() => {
//       service = { ...service, service_is_onprem: true };
//       pluginConnectionentity = {
//         service_id: service.service_id,
//         connection_state: null,
//         connection_form_values: { ...service.service_fields, ...onPremFields },
//         evidence_successfully_collected: 0,
//       };
//       (formBuilder.buildDynamicFormGroup as jasmine.Spy<jasmine.Func>).and.returnValue(builtMockFormGroup);
//       (pluginConnectionFacade.getPluginConnectionEntity as jasmine.Spy<jasmine.Func>).and.returnValue(
//         of(pluginConnectionentity)
//       );
//       (pluginFacade.getLogsOrderedByDate as jasmine.Spy<jasmine.Func>).and.returnValue(
//         of([{ message: 'Fake log' } as ServiceLog])
//       );
//     });

//     it('agents property should be defined if service is On-Prem', async () => {
//       // Arrange
//       // Act
//       await detectChangesWithDefaultValues();

//       // Assert
//       expect(component.agents).toBeTruthy();
//       expect(component.onPremFields).toBeTruthy();
//       expect(component.onPremForm).toBeTruthy();
//     });

//     it('forms should be enabled after component.editForm() method call', async () => {
//       // Arrange
//       // Act
//       await detectChangesWithDefaultValues();
//       component.dynamicFormGroup.enable = jasmine.createSpy('enable');
//       component.onPremForm.enable = jasmine.createSpy('enable');
//       component.editForm();

//       // Assert
//       expect(component.dynamicFormGroup.enable).toHaveBeenCalled();
//       expect(component.onPremForm.enable).toHaveBeenCalled();
//       expect(component.mode).toEqual(FormModes.ON_EDIT);
//     });

//     it('forms should be disabled after component.cancelEditForm() method call', async () => {
//       // Arrange
//       // Act
//       await detectChangesWithDefaultValues();
//       component.dynamicFormGroup.disable = jasmine.createSpy('disable');
//       component.onPremForm.disable = jasmine.createSpy('disable');
//       component.cancelEditForm();

//       // Assert
//       expect(component.dynamicFormGroup.disable).toHaveBeenCalled();
//       expect(component.onPremForm.disable).toHaveBeenCalled();
//       expect(component.mode).toEqual(FormModes.EDITABLE);
//     });
//   });
// });
