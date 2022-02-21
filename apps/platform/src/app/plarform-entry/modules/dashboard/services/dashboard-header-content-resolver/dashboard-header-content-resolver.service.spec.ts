import { DashboardHeaderContentResolverService } from './dashboard-header-content-resolver.service';
import { DashboardHeaderData } from '../../models';
import { SpecificInformationContentValueTypes } from 'core';
import { Service, Framework, ControlStatusEnum } from 'core/modules/data/models/domain';
import { CalculatedControl } from 'core/modules/data/models';

describe('Service: DashboardHeaderContentResolverService', () => {
  let service: DashboardHeaderContentResolverService;
  let mockHeaderData: DashboardHeaderData;
  let mockControls: CalculatedControl[];
  let mockServices: Service[];
  let mockFrameworks: Framework[];
  let mockControlsFrameworksMap: { [key: string]: string };

  beforeEach(() => {
    service = new DashboardHeaderContentResolverService();

    //  MockData
    mockHeaderData = {
      applicableControls: 77,
      automatedEvidence: 171,
      connectedPlugins: 6,
      savedThisYear: 102600,
    };
  });

  mockServices = [
    {
      service_id: 'github',
      service_evidence_list: [{}, {}, {}, {}, {}],
      service_availability_status: 'AVAILABLE',
      service_last_update: new Date(2012, 9, 23),
    },
    {
      service_id: 'aws',
      service_evidence_list: [{}, {}, {}, {}, {}],
      service_availability_status: 'AVAILABLE',
      service_last_update: new Date(2013, 9, 23),
    },
    {
      service_id: 'okta',
      service_evidence_list: [{}, {}, {}, {}, {}],
      service_availability_status: 'COMINGSOON',
      service_last_update: new Date(2015, 9, 23),
    },
  ];
  mockControls = [
    {
      control_id: '222',
      control_has_automated_evidence_collected: true,
      control_number_of_total_evidence_collected: 6,
      control_related_frameworks: ['ISO 27001:2013'],
      control_is_applicable: false,
      control_status: { status: ControlStatusEnum.COMPLIANT },
      control_collected_automated_applicable_evidence_ids: ['44453', '45435', '14'],
    },
    {
      control_id: '221',
      control_has_automated_evidence_collected: true,
      control_number_of_total_evidence_collected: 5,
      control_related_frameworks: ['ISO 27001:2013', 'SOC2'],
      control_is_applicable: true,
      control_status: { status: ControlStatusEnum.COMPLIANT },
      control_collected_automated_applicable_evidence_ids: ['44453', '45435', '14', '5453646'],
    },
    {
      control_id: '223',
      control_has_automated_evidence_collected: true,
      control_number_of_total_evidence_collected: 5,
      control_related_frameworks: ['ISO 27001:2013', 'SOC2'],
      control_is_applicable: true,
      control_status: { status: ControlStatusEnum.INPROGRESS },
      control_collected_automated_applicable_evidence_ids: ['44453', '45435', '14', '5453646'],
    },
  ];
  mockFrameworks = [
    { framework_id: 'ISO 27001:2013', is_applicable: true },
    { framework_id: 'ISO 27001:2013', is_applicable: true },
    { framework_id: 'PCI-DSS v3.2.1', is_applicable: false },
    { framework_id: 'SOC2', is_applicable: true },
  ];

  mockControlsFrameworksMap = {
    223: 'SOC2',
    221: 'ISO 27001:2013',
    222: 'ISO 27001:2013',
  };
  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  describe('Test: getHeaderItems', () => {
    it('should call next methods: getConnectedPluginsItem, getApplicableControlsItem, getCompletedControls, getAutomatedEvidencesItem, getSavedAmount', () => {
      // Act
      service.getHeaderItems(mockHeaderData);

      // Assert
      expect(service.getHeaderItems(mockHeaderData)).toEqual([
        {
          icon: 'dashboard/plugins',
          value: mockHeaderData.connectedPlugins,
          valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
          descriptionTranslateKey: 'items.connectedPlugins',
        },
        {
          icon: 'applicable',
          value: mockHeaderData.applicableControls,
          valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
          descriptionTranslateKey: 'items.applicableControls',
        },
        {
          icon: 'dashboard/automated_evidence',
          value: mockHeaderData.automatedEvidence,
          valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
          descriptionTranslateKey: 'items.automatedEvidences',
        },
        {
          icon: 'dashboard/ROI',
          value: mockHeaderData.savedThisYear,
          valueTypeToRepresent: SpecificInformationContentValueTypes.DOLLAR,
          descriptionTranslateKey: 'items.savedThisYear',
          informationText: 'items.howROICalculated',
        },
      ]);
    });
  });

  describe('Test: getHeaderSectionData', () => {
    it('should return correct header with applicable evidence only ', () => {
      // Act
      const val = service.getHeaderSectionData(mockServices, mockControls, mockFrameworks.map(ef => ef.framework_id), mockControlsFrameworksMap);

      // Assert
      expect(val).toEqual({
        connectedPlugins: 0,
        applicableControls: 2,
        automatedEvidence: 4,
        savedThisYear: 2400,
      });
    });
  });
});
