import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { statusesKeys, statusesStyle } from 'core/modules/shared-controls/models/control-status.constants';
import { ControlStatusesChart } from './control-statuses-chart.component';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { configureTestSuite } from 'ng-bullet';

describe('ControlStatusesChart', () => {
    configureTestSuite();

    let fixture: ComponentFixture<ControlStatusesChart>;
    let component: ControlStatusesChart;

    const mockControls = [
        { control_id: '123', control_name: '123', control_status: { status: ControlStatusEnum.READY_FOR_AUDIT } },
        { control_id: '678', control_name: '123', control_status: { status: ControlStatusEnum.READY_FOR_AUDIT } },
        { control_id: '345', control_name: '789', control_status: { status: ControlStatusEnum.APPROVED_BY_AUDITOR } },
    ];

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ControlsNavigator, useValue: {} },
            ],
            declarations: [ControlStatusesChart],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlStatusesChart);
        component = fixture.componentInstance;
    });

    it('should be able to create component instance', () => {
        expect(component).toBeDefined();
    });

    describe('ngOnChanges', () => {
        beforeEach(() => {
            component.controls = mockControls;
        });

        it('should set controlsGroupedByStatus with correct value', async () => {
            // Arrange
            const changes: SimpleChanges = {
                controls: {
                    currentValue: mockControls,
                } as any,
            };

            const controlsGrouped = [
                {
                    key: ControlStatusEnum.READY_FOR_AUDIT,
                    value: 2,
                    icon: statusesStyle[ControlStatusEnum.READY_FOR_AUDIT]?.icon,
                    color: statusesStyle[ControlStatusEnum.READY_FOR_AUDIT]?.color,
                    translationKey: `frameworks.frameworkManager.overview.statuses.${statusesKeys[ControlStatusEnum.READY_FOR_AUDIT]}`
                },
                {
                    key: ControlStatusEnum.APPROVED_BY_AUDITOR,
                    value: 1,
                    icon: statusesStyle[ControlStatusEnum.APPROVED_BY_AUDITOR]?.icon,
                    color: statusesStyle[ControlStatusEnum.APPROVED_BY_AUDITOR]?.color,
                    translationKey: `frameworks.frameworkManager.overview.statuses.${statusesKeys[ControlStatusEnum.APPROVED_BY_AUDITOR]}`
                }
            ];

            // Act
            component.ngOnChanges(changes);

            // Assert
            expect(component.controlsGroupedByStatus).toEqual(controlsGrouped);
        });

        it('should set doughnutChartData with correct value', async () => {
            // Arrange
            const changes: SimpleChanges = {
                controls: {
                    currentValue: mockControls,
                } as any,
            };

            const doughnutChartData = {
                datasets: [
                    {
                        data: [67, 33],
                        backgroundColor: [statusesStyle[ControlStatusEnum.READY_FOR_AUDIT]?.color, statusesStyle[ControlStatusEnum.APPROVED_BY_AUDITOR]?.color]
                    }
                ]
            };

            //   // Act
            component.ngOnChanges(changes);

            //   // Assert
            expect(component.doughnutChartData).toEqual(doughnutChartData);
        });

        it('should set percent with correct value', async () => {
            // Arrange
            const changes: SimpleChanges = {
                controls: {
                    currentValue: mockControls,
                } as any,
            };

            const percent = '67';

            // Act
            component.ngOnChanges(changes);

            // Assert
            expect(component.percent).toEqual(percent);
        });
    });
});
