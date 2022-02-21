import { RequirementService } from 'core/modules/data/services/requirement/requirement.service';
import {
  ZendeskGroupMetadata,
  ZendeskTicketFieldMetadata,
  ZendeskMetadata,
} from 'core/modules/data/models/domain';
import { TicketingModalsCommonTranslationRootKey } from '../constants/constants';
import { CalculatedControl } from 'core/modules/data/models/calculated-control.model';
import { ControlRequirement, Service } from 'core/modules/data/models/domain';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { configureTestSuite } from 'ng-bullet';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives';
import { ModalWindowService } from 'core/modules/modals';
import { PluginsMetaFacadeService } from 'core/modules/data/services/facades/plugins-meta-facade/plugins-meta-facade.service';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { PluginService } from 'core/modules/data/services/plugin/plugin.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { noValueTicketField, ZendeskAutomationModalWindowComponent } from './zendesk-automation-modal-window.component';
import { Observable, of } from 'rxjs';
import { TemplateRef } from '@angular/core';
import { AppConfigService, ConfigurationFile } from 'core';
import { EvidenceFacadeService, PluginFacadeService, RequirementsFacadeService } from 'core/modules/data/services';

describe('ZendeskAutomationModalWindowComponent', () => {
  configureTestSuite();
  let component: ZendeskAutomationModalWindowComponent;
  let fixture: ComponentFixture<ZendeskAutomationModalWindowComponent>;

  let messageBusService: MessageBusService;
  let pluginsMetaFacadeService: PluginsMetaFacadeService;
  let pluginService: PluginService;
  let appConfigService: AppConfigService;
  let pluginFacadeService: PluginFacadeService;

  let pluginData: Service;
  let requirement: ControlRequirement;
  let control: CalculatedControl;

  const mockGroups: ZendeskGroupMetadata[] = [
    {
      name: 'FirstTestname',
      url: 'FirstTestUrl',
    },
    {
      name: 'Second',
      url: 'secondurl',
    },
  ];

  const mockTicketFields: ZendeskTicketFieldMetadata[] = [
    {
      title: 'FirstTitle',
      type: 'FirstType',
    },
    {
      title: 'SecondTitle',
      type: 'SecondType',
      custom_field_options: [
        {
          name: 'Custom option',
          value: 'custom value',
          id: 12345,
        },
      ],
    },
    {
      title: 'ThirdTitle',
      type: ' ThirdType',
      system_field_options: [
        {
          name: 'system option',
          value: 'system value',
        },
      ],
    },
  ];

  const mockMetadata: ZendeskMetadata = { groups: mockGroups, ticket_fields: mockTicketFields };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZendeskAutomationModalWindowComponent],
      providers: [
        {
          provide: PluginService,
          useValue: {
            getServiceIconLink: (serviceId: string, isLarge = false): Observable<string> => of('iconLink'),
          },
        },
        { provide: PluginFacadeService, useValue: {}},
        { provide: ModalWindowService, useValue: {} },
        {
          provide: MessageBusService,
          useValue: {
            getObservable: () => {},
          },
        },
        {
          provide: PluginsMetaFacadeService,
          userValue: {},
        },
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: RequirementService, useValue: {} },
        { provide: AppConfigService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },

      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    fixture = TestBed.createComponent(ZendeskAutomationModalWindowComponent);
    component = fixture.componentInstance;

    pluginData = { service_id: 'test_service_id', service_instances_list: [{service_instance_id: 'someInstanceId', service_id: 'test_service_id', service_status: 'SERVICE_INSTALLED' }] };
    requirement = { requirement_id: 'requirementId', requirement_name: 'testName' };
    control = { control_id: 'controlId' };

    component.pluginData = pluginData;
    component.controlRequirement = requirement;
    component.controlInstance = control;

    pluginFacadeService = TestBed.inject(PluginFacadeService);
    pluginFacadeService.getServiceById = jasmine.createSpy('getServiceById').and.returnValue(of(pluginData));
    pluginsMetaFacadeService = TestBed.inject(PluginsMetaFacadeService);
    pluginService = TestBed.inject(PluginService);
    appConfigService = TestBed.inject(AppConfigService);
    (appConfigService as any).config = {
      redirectUrls: {
        intercomZendeskCustomizationHelp: 'fake'
      }
    } as ConfigurationFile;
    messageBusService.getObservable = jasmine.createSpy('getObservable').and.returnValue(of({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should set metdata values to its appropriate inputs', async () => {
      // Arrange
      pluginsMetaFacadeService.getServiceMetadata = jasmine
        .createSpy('getServiceMetadata')
        .and.returnValue(of(mockMetadata));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.form.items.group.inputs.data).toEqual(mockGroups);
      expect(component.form.items.ticketTypeField.inputs.data).toEqual(mockTicketFields);
    });
  });

  describe('form value changes', () => {
    beforeEach(() => {
      pluginsMetaFacadeService.getServiceMetadata = jasmine
        .createSpy('getServiceMetadata')
        .and.returnValue(of(mockMetadata));
    });

    it('ticketType should be disabled whether ticketTypeField is not selected but group was', async () => {
      // Arrange

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.form.setValue({ group: mockGroups[0], ticketTypeField: null, ticketType: null });

      // Assert
      expect(component.form.items.ticketType.inputs.isDisabled).toBeTrue();
    });

    it('ticketType should be disabled whether group is not selected but ticketTypeField was', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.form.setValue({ group: null, ticketTypeField: mockTicketFields[1], ticketType: null });

      // Assert
      expect(component.form.items.ticketType.inputs.isDisabled).toBeTrue();
    });

    it('should enable ticketType when group and ticketFieldType are selected', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.form.setValue({ group: mockGroups[0], ticketTypeField: mockGroups[0], ticketType: null });

      // Assert
      expect(component.form.items.ticketType.inputs.isDisabled).toBeFalse();
    });

    it('should set \'no values\' for ticketType selected ticketFieldType has no system_field_options or custom_field_options', async () => {
      // Arrange
      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.form.items.group.setValue(mockGroups[0]);
      component.form.items.ticketTypeField.setValue(
        mockTicketFields.find((field) => !field.system_field_options?.length || !field.custom_field_options?.length)
      );

      // Assert
      expect(component.form.items.ticketType.value).toEqual(noValueTicketField);
      expect(component.form.items.ticketType.inputs.data).toEqual(null);
    });

    it('should set system_field_options or custom_field_options values to ticketType dropdown if selected ticketTypeField value has any of them', async () => {
      // Arrange
      const ticketTypeFieldToSelect = mockTicketFields.find(
        (field) => field.system_field_options?.length || field.custom_field_options?.length
      );
      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      component.form.items.group.setValue(mockGroups[0]);
      component.form.items.ticketTypeField.setValue(ticketTypeFieldToSelect);

      // Assert
      expect(component.form.items.ticketType.value).toEqual(null);
      expect(component.form.items.ticketType.inputs.data).toEqual(
        ticketTypeFieldToSelect.system_field_options || ticketTypeFieldToSelect.custom_field_options
      );
    });
  });

  describe('#ngAfterViewInit', () => {
    it('should init tabModel$', (done) => {
      // Arrange
      component.pluginData.service_display_name = 'display_name';
      const icon = 'testIconPath';
      spyOn(pluginService, 'getServiceIconLink').and.returnValue(of(icon));

      // Act
      component.ngAfterViewInit();

      // Assert
      component.tabModel$.subscribe((value) => {
        expect(value).toEqual([
          {
            tabTemplate: jasmine.any(TemplateRef),
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

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`${TicketingModalsCommonTranslationRootKey}.zendeskAutomationModal.${relativeKey}`);
    });
  });

  describe('#isValid', () => {
    beforeEach(async () => {
      pluginsMetaFacadeService.getServiceMetadata = jasmine
        .createSpy('getServiceMetadata')
        .and.returnValue(of(mockMetadata));
    });
    it('should return false if ticketType are not selected', async () => {
      // Arrange
      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      component.form.items.group.setValue(mockGroups[0]);

      // Assert
      expect(component.form.valid).toBeFalse();
    });

    it('isValid should be true when all dropdowns are selected', async () => {
      // Arrange
      fixture.detectChanges();
      await fixture.whenStable();

      // Act
      component.form.items.group.setValue(mockGroups[0]);
      component.form.items.ticketTypeField.setValue(mockTicketFields[0]);

      // Assert
      expect(component.isValid).toBeTrue();
    });
  });
});
