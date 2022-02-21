import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FrameworkReference, CalculatedPolicy } from 'core/modules/data/models';
import { DataAggregationFacadeService, PoliciesFacadeService } from 'core/modules/data/services';
import { ControlsNavigator } from 'core/modules/shared-controls/services/controls-navigator/controls-navigator.service';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { PolicyLinkedControlsLabelComponent } from './policy-linked-controls-label.component';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { LinkedEntity } from 'core/modules/utils/types';

describe('PolicyLinkedControlsLabelComponent', () => {
  configureTestSuite();

  let componentUnderTest: PolicyLinkedControlsLabelComponent;
  let fixture: ComponentFixture<PolicyLinkedControlsLabelComponent>;

  let dataAggregationFacade: DataAggregationFacadeService;
  let controlsNavigatorMock: ControlsNavigator;
  let policiesFacadeServiceMock: PoliciesFacadeService;
  let policyManagerEventServiceMock: PolicyManagerEventService;

  const result: FrameworkReference[] = [
    {
      framework: { framework_name: 'some-framework-1' },
      controls: [{ control_id: 'some-control-name-1' }, { control_id: 'some-control-name-2' }],
    },
    {
      framework: { framework_name: 'some-framework-2' },
      controls: [{ control_id: 'some-control-name-6' }],
    },
    {
      framework: { framework_name: 'some-framework-3' },
      controls: [
        { control_id: 'some-control-name-3' },
        { control_id: 'some-control-name-7' },
        { control_id: 'some-control-name-8' },
      ],
    },
  ];
  const fakePolicy: CalculatedPolicy = { policy_name: 'fake', policy_id: 'fake-id' };

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [PolicyLinkedControlsLabelComponent],
      providers: [
        { provide: ControlsNavigator, useValue: {} },
        { provide: DataAggregationFacadeService, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyLinkedControlsLabelComponent);
    componentUnderTest = fixture.componentInstance;
    componentUnderTest.policyId = 'policy-id-1';

    dataAggregationFacade = TestBed.inject(DataAggregationFacadeService);
    dataAggregationFacade.getPolicyReferences = jasmine.createSpy('getPolicyReferences').and.callFake(() => of(result));
    controlsNavigatorMock = TestBed.inject(ControlsNavigator);
    policiesFacadeServiceMock = TestBed.inject(PoliciesFacadeService);
    policiesFacadeServiceMock.getPolicy = jasmine.createSpy('getPolicy').and.callFake(() => of(fakePolicy));
    policyManagerEventServiceMock = TestBed.inject(PolicyManagerEventService);
    policyManagerEventServiceMock.trackLinkedControlClickEvent = jasmine.createSpy('trackLinkedControlClickEvent');
    controlsNavigatorMock.navigateToControlAsync = jasmine.createSpy('controlsNavigatorMock.navigateToControlAsync');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  it('buildTranslationKey method should return appropriate key', async () => {
    // Arrange
    const relativeKey = 'some-key';
    const resultKey = `policyManager.${relativeKey}`;

    // Act
    const methodResult = componentUnderTest.buildTranslationKey(relativeKey);

    // Assert
    expect(methodResult).toEqual(resultKey);
  });

  describe('viewControl function', () => {
    const linkedEntity: LinkedEntity = { title: 'fake', id: 'some-control-name' };

    it('should call navigateToControlAsync with provided entity id', async () => {
      // Arrange
      // Act
      componentUnderTest.viewControl(linkedEntity);

      // Assert
      expect(controlsNavigatorMock.navigateToControlAsync).toHaveBeenCalledWith(linkedEntity.id);
    });

    it('should track LinkedControlClickEvent', () => {
      // Arrange
      // Act
      componentUnderTest.viewControl(linkedEntity);

      // Assert
      expect(policyManagerEventServiceMock.trackLinkedControlClickEvent).toHaveBeenCalledWith(
        fakePolicy,
        ['some-framework-1', 'some-framework-2', 'some-framework-3'],
        6
      );
    });
  });
});
