import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { CalculatedControl } from 'core/modules/data/models';
import { configureTestSuite } from 'ng-bullet';
import { ControlsProgressBarComponent } from './controls-progress-bar.component';

describe('ControlsProgressBarComponent', () => {
  configureTestSuite();

  let component: ControlsProgressBarComponent;
  let fixture: ComponentFixture<ControlsProgressBarComponent>;
  let fakeControls: CalculatedControl[];
  const expectedOrderedStatusAndClassMapping = {
    [ControlStatusEnum.NOTSTARTED]: 'bg-navy-60',
    [ControlStatusEnum.INPROGRESS]: 'bg-orange-50',
    [ControlStatusEnum.READY_FOR_AUDIT]: 'bg-blue-50',
    [ControlStatusEnum.GAP]: 'bg-pink-70',
    [ControlStatusEnum.ISSUE]: 'bg-orange-70',
    [ControlStatusEnum.APPROVED_BY_AUDITOR]: 'bg-blue-70',
  };

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ControlsProgressBarComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsProgressBarComponent);
    component = fixture.componentInstance;
    fakeControls = [
      { control_status: { status: ControlStatusEnum.GAP } },
      { control_status: { status: ControlStatusEnum.NOTSTARTED } },
      { control_status: { status: ControlStatusEnum.NOTSTARTED } },
      { control_status: { status: ControlStatusEnum.INPROGRESS } },
      { control_status: { status: ControlStatusEnum.INPROGRESS } },
      { control_status: { status: ControlStatusEnum.INPROGRESS } },
      { control_status: { status: ControlStatusEnum.ISSUE } },
      { control_status: { status: ControlStatusEnum.NOTSTARTED } },
      { control_status: { status: ControlStatusEnum.READY_FOR_AUDIT } },
      { control_status: { status: ControlStatusEnum.ISSUE } },
      { control_status: { status: ControlStatusEnum.APPROVED_BY_AUDITOR } },
      { control_status: { status: ControlStatusEnum.READY_FOR_AUDIT } },
      { control_status: { status: ControlStatusEnum.ISSUE } },
    ];
    component.controls = fakeControls;
  });

  describe('statusBarDefinition input', () => {
    [
      ControlStatusEnum.NOTSTARTED,
      ControlStatusEnum.INPROGRESS,
      ControlStatusEnum.ISSUE,
      ControlStatusEnum.GAP,
      ControlStatusEnum.READY_FOR_AUDIT,
      ControlStatusEnum.APPROVED_BY_AUDITOR,
    ].forEach((statusTestCase) => {
      describe(`${statusTestCase} status`, () => {
        let index: number;

        beforeEach(() => {
          index = Object.keys(expectedOrderedStatusAndClassMapping).findIndex(
            (status: ControlStatusEnum) => status === statusTestCase
          );
        });

        it('should have cssClass', () => {
          // Arrange
          // Act
          // Assert
          expect(component.statusBarDefinition[index].cssClass).toBe(
            expectedOrderedStatusAndClassMapping[statusTestCase]
          );
        });

        it('should have count equal to controls count by the status', () => {
          // Arrange
          // Act
          // Assert
          expect(component.statusBarDefinition[index].count).toBe(
            fakeControls.filter((control) => control.control_status.status === statusTestCase).length
          );
        });
      });
    });
  });
});
