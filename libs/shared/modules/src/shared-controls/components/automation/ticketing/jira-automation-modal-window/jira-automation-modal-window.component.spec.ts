import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannedActionsSubject } from '@ngrx/store';
import {
  EvidenceCollectionMessages,
  MessageBusService,
  WindowHelperService,
} from 'core';
import { ModalWindowService } from 'core/modules/modals/services';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { EvidenceTypeEnum, Service, ServiceTypeEnum } from 'core/modules/data/models/domain';
import {
  ControlsFacadeService,
  EvidenceFacadeService,
  PluginFacadeService,
  PluginService,
  PluginsMetaFacadeService,
  RequirementService,
  RequirementsFacadeService,
} from 'core/modules/data/services';
import { TicketingModalsCommonTranslationRootKey } from '../constants/constants';
import { ModalsBuilderService } from '../services';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { JiraAutomationModalWindowComponent } from './jira-automation-modal-window.component';

describe('JiraAutomationModalWindowComponent', () => {
  configureTestSuite();

  let component: JiraAutomationModalWindowComponent;
  let fixture: ComponentFixture<JiraAutomationModalWindowComponent>;
  let pluginService: PluginService;
  let windowHelperService: WindowHelperService;
  let messageBusService: MessageBusService;
  let modalBuilderService: ModalsBuilderService;
  let controlsFacade: ControlsFacadeService;
  let metaFacade: PluginsMetaFacadeService;
  let modalWindowService: ModalWindowService;
  let evidenceFacade: EvidenceFacadeService;
  let pluginFacadeService: PluginFacadeService;

  const evidenceIds = ['id1', 'id2'];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [JiraAutomationModalWindowComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: PluginService,
          useValue: {
            getServiceIconLink: (serviceId: string, isLarge = false): Observable<string> => of('iconLink'),
          },
        },
        { provide: RequirementService, useValue: {} },
        { provide: ModalsBuilderService, useValue: {} },
        { provide: PluginFacadeService, useValue: {}},
        {
          provide: MessageBusService,
          useValue: {},
        },
        ScannedActionsSubject,
        { provide: PluginsMetaFacadeService, userValue: {} },
        {
          provide: WindowHelperService,
          useValue: {
            openUrlInNewTab: (url: string) => window,
          },
        },
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    evidenceFacade = TestBed.inject(EvidenceFacadeService);
    evidenceFacade.addEvidenceFromTicketAsync = jasmine
      .createSpy('addEvidenceFromTicket')
      .and.callFake(() => evidenceIds);

    fixture = TestBed.createComponent(JiraAutomationModalWindowComponent);
    component = fixture.componentInstance;

    pluginService = TestBed.inject(PluginService);
    windowHelperService = TestBed.inject(WindowHelperService);
    pluginFacadeService = TestBed.inject(PluginFacadeService);
    pluginFacadeService.getServiceById = jasmine.createSpy('getServiceById').and.returnValue(of({ service_id: 'some-service-id', service_display_name: 'some-service-name', service_instances_list: [{ service_id: 'service_id', service_instance_id: 'some-service-instance-id', service_instance_display_name: 'service_display_name' }] } as Service));
   

    modalBuilderService = TestBed.inject(ModalsBuilderService);
    modalBuilderService.openAllTicketingPlugins = jasmine.createSpy('openAllTicketingPlugins');
    modalBuilderService.openTicketingModalForPlugin = jasmine.createSpy('openTicketingModalForPlugin');
    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openSuccessAlert = jasmine.createSpy('openSuccessAlert');
    modalWindowService.close = jasmine.createSpy('close');

    controlsFacade = TestBed.inject(ControlsFacadeService);
    controlsFacade.getSingleControl = jasmine.createSpy('getSingleControl').and.returnValue(
      of({
        control_calculated_requirements: [{ requirement_id: 'some-requirement-id' }],
      })
    );

    metaFacade = TestBed.inject(PluginsMetaFacadeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.controlRequirement = { requirement_name: 'requirement_name' };
      component.pluginData = { service_id: 'bla' };
    });

    it('should set projects data to projects input', async () => {
      // Arrange
      const projects = [{ anecdotes_id: '1', name: 'project' }];
      metaFacade.getServiceMetadata = jasmine.createSpy('getServiceMetadata').and.returnValue(of({ projects }));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.form.items.project.inputs.data).toEqual(projects);
    });

    it('should reset issueType when set projects input value changes', async () => {
      // Arrange
      const project = { anecdotes_id: '1', name: 'project' };
      metaFacade.getServiceMetadata = jasmine
        .createSpy('getServiceMetadata')
        .and.returnValue(of({ projects: [project] }));

      // Act
      fixture.detectChanges();
      spyOn(component.form.items.issueType, 'reset');
      component.form.setValue({ project, issueType: null });
      await fixture.whenStable();

      // Assert
      expect(component.form.items.issueType.reset).toHaveBeenCalled();
    });

    it('should set issueType data to issueType input when set projects input value changes', async () => {
      // Arrange
      const issue_types = [{ anecdotes_id: '1', name: 'issueType' }];
      const project = { anecdotes_id: '1', name: 'project', issue_types };
      metaFacade.getServiceMetadata = jasmine
        .createSpy('getServiceMetadata')
        .and.returnValue(of({ projects: [project] }));

      // Act
      fixture.detectChanges();
      component.form.setValue({ project, issueType: null });
      await fixture.whenStable();

      // Assert
      expect(component.form.items.issueType.inputs.data).toEqual(issue_types);
    });

    it('should set issueType isDisabled = false when set projects input value changes', () => {
      // Arrange
      const issue_types = [{ anecdotes_id: '1', name: 'issueType' }];
      const project = { anecdotes_id: '1', name: 'project1', issue_types };
      metaFacade.getServiceMetadata = jasmine
        .createSpy('getServiceMetadata')
        .and.returnValue(of({ projects: [project] }));

      // Act
      fixture.detectChanges();
      component.form.setValue({ project, issueType: null });

      // Assert
      expect(component.form.items.issueType.inputs.isDisabled).toBeFalse();
    });
  });

  describe('#ngAfterViewInit', () => {
    it('should init tabModel$', (done) => {
      // Arrange
      component.pluginData = { service_display_name: 'display_name' };
      const icon = 'testIconPath';
      spyOn(pluginService, 'getServiceIconLink').and.returnValue(of(icon));

      // Act
      component.ngAfterViewInit();

      // Assert
      component.tabModel$.subscribe((value) => {
        expect(value).toEqual([
          {
            tabTemplate: undefined,
            translationKey: 'display_name',
            icon,
          },
        ]);
        done();
      });
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';
      component.translationKey = 'jiraAutomationModal';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`${TicketingModalsCommonTranslationRootKey}.jiraAutomationModal.${relativeKey}`);
    });
  });

  describe('#openArticle', () => {
    it('should call windowHelperService.openUrlInNewTab with proper parameters', () => {
      // Arrange
      const intercomJiraCustomizationHelp = 'fake-customization-help';
      component.articleUrl = intercomJiraCustomizationHelp;
      spyOn(windowHelperService, 'openUrlInNewTab');

      // Act
      component.openArticle();

      // Assert
      expect(windowHelperService.openUrlInNewTab).toHaveBeenCalledWith(intercomJiraCustomizationHelp);
    });

    beforeEach(() => {
      component.pluginData = { service_id: 'bla' };
      component.controlRequirement = { requirement_name: 'requirement_name' };
      const projects = [{ anecdotes_id: '1', name: 'project' }];
      metaFacade.getServiceMetadata = jasmine.createSpy('getServiceMetadata').and.returnValue(of({ projects }));
    });

    describe('#isValid', () => {
      const issueType = { anecdotes_id: 'issue1', name: 'issueType' };
      const issue_types = [issueType];
      const project = { anecdotes_id: 'project1', name: 'project1', issue_types };

      it('should return true if project and issue type are selected', () => {
        // Arrange

        // Act
        fixture.detectChanges();
        component.form.setValue({ project, issueType });
        const actual = component.isValid;

        // Assert
        expect(actual).toBeTrue();
      });

      it('should return false if project is not selected', () => {
        // Arrange
        
        // Act
        fixture.detectChanges();
        component.form.setValue({ project: null, issueType: null });
        const actual = component.isValid;

        // Assert
        expect(actual).toBeFalse();
      });

      it('should return false if issueType is not selected', () => {
        // Arrange
        
        // Act
        fixture.detectChanges();
        component.form.setValue({ project, issueType: null });
        const actual = component.isValid;

        // Assert
        expect(actual).toBeFalse();
      });
    });

    describe('#createEvidence', () => {
      const issueType = { anecdotes_id: 'issue1', name: 'issueType' };
      const issue_types = [issueType];
      const project = { anecdotes_id: 'project1', name: 'project1', issue_types };
      const service_id = 'some-service-id';
      const service_instance_id = 'some-service-instance-id';
      const service_display_name = 'some-service-name';
      const service_type = ServiceTypeEnum.TICKETING;
      const requirement_id = 'some-requirement-id';
      const control_id = 'some-control-id';
      const controlName = 'controlName';
      const controlCategory = 'controlCategory';
      const framework_id = 'some-framework-id';


      beforeEach(() => {

        component.pluginData = {
          service_id,
          service_display_name,
          service_type,
          service_metadata: { projects: [project] },
        };
        component.controlInstance = { control_category: controlCategory, control_name: controlName, control_id: control_id };
        component.controlRequirement = {requirement_id: requirement_id};
        component.framework = {framework_id: framework_id};
        fixture.detectChanges();
        component.form.setValue({ project, issueType });
        component.pluginData = { service_id: 'bla' };

      });

      it('isLoading$ should emit true', () => {
        // Act
        component.createEvidence();

        // Assert
        expect(component.isLoading$.value).toBeTrue();
      });

      it('should call createRequirementTicketingEvidence of requirementService with proper parameters', async () => {
        // Act
        await component.createEvidence();
        // Assert
        expect(evidenceFacade.addEvidenceFromTicketAsync).toHaveBeenCalledWith(
          requirement_id,
          service_id,
          service_instance_id,
          ['project1', 'issue1'],
          framework_id,
          control_id
        );
      });

      it(`should call messageBusService.sendMessage with EvidenceCollectionMessages.COLLECTION_STARTED as key,
    requirement_id as partition key and collectingEvidences formed from response`, async () => {
        // Arrange
        const collectingEvidences = evidenceIds.map((evidenceId) => ({
          evidenceId,
          serviceId: service_id,
          evidenceType: EvidenceTypeEnum.TICKET,
          serviceDisplayName: service_display_name,
        }));

        // Act
        await component.createEvidence();

        // Assert
        expect(messageBusService.sendMessage).toHaveBeenCalledWith(
          EvidenceCollectionMessages.COLLECTION_STARTED,
          collectingEvidences,
          requirement_id
        );
      });

      it('should close modal', async () => {
        // Act
        await component.createEvidence();

        // Assert
        expect(modalWindowService.close).toHaveBeenCalled();
      });

      it('isLoading$ should emit false when method executed', async () => {
        // Act
        await component.createEvidence();

        // Assert
        expect(component.isLoading$.value).toBeFalse();
      });
    });
  });
});
