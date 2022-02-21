import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatusEnum, Framework } from 'core/modules/data/models/domain';
import { statusesStyle, statusesKeys } from 'core/modules/shared-controls/models/control-status.constants';
import { createSortCallback, groupBy, getPercents } from 'core/utils';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { ExploreControlsSource } from 'core';

interface DougnutChartDefinition {
  data: number[];
  colors: string[];
}

const statusOrderingDictionary = Object.keys(statusesKeys).reduce(
  (dict, key, index) => ({ ...dict, [key]: index }),
  {}
);

@Component({
  selector: 'app-control-statuses-chart',
  templateUrl: './control-statuses-chart.component.html',
  styleUrls: ['./control-statuses-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlStatusesChart implements OnChanges {
  @Input()
  controls;
  @Input()
  framework: Framework;
  @Input()
  isAuditInProgress = false;

  controlsGroupedByStatus;
  percent: string;
  doughnutChartData: ChartData;
  chartOptions: ChartOptions<'doughnut'> = {
    cutout: '80%',
    radius: '76',
    animation: {
      animateRotate: false,
    },
    responsive: true,
    events: [],
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  controlsGroupWithHighestValue: { [key: string]: any };

  doughnutChartType: ChartType = 'doughnut';

  constructor(private controlsNavigator: ControlsNavigator) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('controls' in changes) {
      this.controlsGroupedByStatus = this.getControlsDataGroupByStatus(this.controls);
      const { data, colors } = this.getChartData(this.controlsGroupedByStatus);

      // To prevent from small values to not be displayed/looks with not enough space, we convert data to be in precent and add more “weight” to the small values.
      const total = data.reduce((sum, curr) => sum + curr);
      const inPrecentData = data.map((curr) => Math.round(Math.max((curr / total) * 100, 1)));

      this.doughnutChartData = {
        datasets: [
          {
            data: inPrecentData,
            backgroundColor: colors,
          },
        ],
      };

      this.controlsGroupWithHighestValue = this.getControlsGroupWithHighestValue();
      this.percent = getPercents(this.controlsGroupWithHighestValue.value, this.controls.length);
    }
  }

  buildTranslationKey(key: string): string {
    return `frameworks.frameworkManager.overview.statuses.${key}`;
  }

  exploreControls(filterByStatus: string): void {
    this.controlsNavigator.navigateToControlsPageAsync(
      this.framework.framework_id,
      { status: filterByStatus },
      ExploreControlsSource.FrameworkOverview
    );
  }

  trackByFn(index: number, obj: any): any {
    return obj ? obj.key : index;
  }

  private getControlsGroupWithHighestValue(): { [key: string]: any } {
    return [...this.controlsGroupedByStatus].sort((group1, group2) => group2.value - group1.value)[0];
  }

  private getControlsDataGroupByStatus(controls: CalculatedControl[]): any[] {
    if (!controls?.length) {
      return [];
    }

    return groupBy(controls, (c) => c.control_status.status)
      .sort(createSortCallback((group) => statusOrderingDictionary[group.key]))
      .filter((status) => statusesKeys[status.key])
      .map((status: { key: ControlStatusEnum; values: CalculatedControl[] }) => {
        return {
          key: status.key,
          value: status.values.length,
          icon: statusesStyle[status.key]?.icon,
          color: statusesStyle[status.key]?.color,
          translationKey: this.buildTranslationKey(`${statusesKeys[status.key]}`),
        };
      });
  }

  private getChartData(controlsGrouped): DougnutChartDefinition {
    const initialValue: DougnutChartDefinition = {
      data: [],
      colors: [],
    };

    return controlsGrouped.reduce((prev: DougnutChartDefinition, curr) => {
      return {
        data: [...prev.data, curr.value],
        colors: [...prev.colors, curr.color],
      } as DougnutChartDefinition;
    }, initialValue);
  }
}
