import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngrx/effects';
import { ScannedActionsSubject } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ResourceType } from 'core/modules/data/models';
import { Service, ServiceTypeEnum } from 'core/modules/data/models/domain';
import { MessageBusService } from 'core/services';
import { ModalWindowService } from 'core/modules/modals';
import {
  ControlsFacadeService,
  EvidenceFacadeService,
  EvidenceService,
  PluginNotificationFacadeService,
  PluginFacadeService,
  PluginService,
  RequirementService
} from 'core/modules/data/services';
import { PluginNotificationSenderService } from 'core/services/plugin-notification-sender/plugin-notification-sender.service';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AttachLinkModalWindowComponent } from './attach-link-modal-window.component';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { EvidenceCreationModalParams } from '../../../../models';

describe('AttachLinkModalWindowComponent', () => {
  configureTestSuite();

  let component: AttachLinkModalWindowComponent;
  let fixture: ComponentFixture<AttachLinkModalWindowComponent>;
  let requirementService: RequirementService;
  let messageBusService: MessageBusService;
  let modalWindowService: ModalWindowService;
  let pluginService: PluginService;
  let evidenceService: EvidenceService;
  let notificationService: PluginNotificationFacadeService;
  let pluginNotificationSenderService: PluginNotificationSenderService;
  let router: Router;
  let evidenceFacade: EvidenceFacadeService;
  let pluginFacadeService: PluginFacadeService;
  let policyManagerEventService: PolicyManagerEventService;
  let sharedContext$: BehaviorSubject<EvidenceCreationModalParams>;

  const service_display_name = 'some-service-display-name';
  const service_type = ServiceTypeEnum.FILEMONITOR;
  const requirement_name = 'some-requirement-name';
  const requirement_id = 'some-requirement-id';
  const control_id = 'control-id';
  const service_id = 'service-id';
  const service_instance_id = 'service-instance-id';
  const framework_id = 'framework-id';

  const evidenceIds = ['id1', 'id2'];
  const pluginRoute = 'route';

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AttachLinkModalWindowComponent],
      providers: [
        {
          provide: PluginService,
          useValue: {
            getServiceIconLink(_: string): Observable<string> {
              return of('bla');
            },
          },
        },
        { provide: PluginFacadeService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: RequirementService, useValue: {} },
        ModalWindowService,
        MessageBusService,
        Actions,
        ScannedActionsSubject,
        {
          provide: ControlsFacadeService,
          useValue: {
            getSingleControl(_: any): Observable<any> {
              return of('');
            },
          },
        },
        { provide: ComponentSwitcherDirective, useValue: {} },
        {
          provide: PluginNotificationFacadeService,
          useValue: {},
        },
        { provide: PluginNotificationSenderService, useValue: {} },
        { provide: EvidenceService, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },

        provideMockStore(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachLinkModalWindowComponent);
    component = fixture.componentInstance;

    requirementService = TestBed.inject(RequirementService);
    requirementService.addRequirementEvidence = jasmine
      .createSpy('addRequirementEvidence')
      .and.callFake(() => of({ evidence_id: evidenceIds }));

    pluginFacadeService = TestBed.inject(PluginFacadeService);
    pluginFacadeService.getServiceById = jasmine.createSpy('getServiceById').and.callFake(() => of({ service_id: service_id, service_display_name: service_display_name, service_instances_list: [{ service_id: service_id, service_instance_id: service_instance_id, service_instance_display_name: service_display_name }] } as Service));
    evidenceFacade = TestBed.inject(EvidenceFacadeService);
    evidenceFacade.createSharedLinkEvidenceAsync = jasmine
      .createSpy('createSharedLinkEvidenceAsync')
      .and.callFake(() => Promise.resolve());

    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.close = jasmine.createSpy('close');

    pluginService = TestBed.inject(PluginService);
    pluginService.getPluginRoute = jasmine.createSpy('getPluginRoute').and.callFake(() => pluginRoute);

    evidenceService = TestBed.inject(EvidenceService);
    evidenceService.addEvidence = jasmine.createSpy('addEvidence').and.callFake(() => of({ evidence_id: evidenceIds }));

    notificationService = TestBed.inject(PluginNotificationFacadeService);
    notificationService.getNotification = jasmine.createSpy('getNotification').and.callFake((_: any) => of({}));

    pluginNotificationSenderService = TestBed.inject(PluginNotificationSenderService);
    pluginNotificationSenderService.sendCollectionFailedNotification = jasmine
      .createSpy('sendCollectionFailedNotification')
      .and.callFake((_: any) => of({}).toPromise());

    router = TestBed.inject(Router);
    router.navigate = jasmine.createSpy('navigate');

    policyManagerEventService = TestBed.inject(PolicyManagerEventService);
    policyManagerEventService.trackLinkPolicyEvent = jasmine.createSpy('trackLinkPolicyEvent');

    component.pluginData = { service_id, service_display_name, service_type };
    component.requirementLike = {
      name: requirement_name,
      resourceId: requirement_id,
      resourceType: ResourceType.Requirement,
    };
    component.framework = { framework_id: framework_id };
    component.control = { control_id: control_id };
    const switcher = TestBed.inject(ComponentSwitcherDirective);
    sharedContext$ = new BehaviorSubject<EvidenceCreationModalParams>({
      serviceIds: [],
      entityPath: [],
      targetResource: {
        resourceId: 'fakeResourceId',
        resourceType: 'fakeResourceType'
      }
    });
    (switcher as any).sharedContext$ = sharedContext$;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#connect', () => {
    describe('create evidence', () => {
      const link = 'some-link';

      beforeEach(() => {
        fixture.detectChanges();
        component.formControl.setValue(link);
      });

      it('isLoading$ should emit true', () => {
        // Act
        component.connect();

        // Assert
        expect(component.isLoading$.value).toBeTrue();
      });

      it('should call createRequirementLinkEvidence of requirementService with proper parameters', fakeAsync(() => {
        // Act
        component.connect();
        tick(100);

        // Assert
        expect(evidenceFacade.createSharedLinkEvidenceAsync).toHaveBeenCalledWith(
          link,
          service_id,
          service_instance_id,
          jasmine.objectContaining({
            resourceId: 'fakeResourceId',
            resourceType: 'fakeResourceType'
          }),
          control_id,
          framework_id,
        );
      }));

      it('should close modal', fakeAsync(() => {
        // Act
        component.connect();
        tick();

        // Assert
        expect(modalWindowService.close).toHaveBeenCalled();
      }));

      it('isLoading$ should emit false when method executed', fakeAsync(() => {
        // Act
        component.connect();
        tick();

        // Assert
        expect(component.isLoading$.value).toBeFalse();
      }));
    });
  });

  describe('#navigateToPlugin', () => {
    it('should call router.navigate with resolved route from pluginService.getPluginRoute', () => {
      // Act
      component.navigateToPlugin();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([pluginRoute]);
    });

    it('should call router.navigate with resolved route from pluginService.getPluginRoute and "tab" query parameter', () => {
      // Act
      const tabName = 'logs';
      component.navigateToPlugin(tabName);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([pluginRoute], {
        queryParams: {
          tab: tabName,
        },
      });
    });
  });
});
