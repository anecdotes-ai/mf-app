import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import {
  ResidualRiskLevelImpactEnum,
  ResidualRiskLevelLikeHoodEnum,
  ResidualRiskLevelEnum,
} from 'core/modules/risk/models';
import { RiskLevelBGClasses } from '../../constants';

@Component({
  selector: 'app-risk-registry',
  templateUrl: './risk-registry.component.html',
  styleUrls: ['./risk-registry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskRegistryComponent implements OnInit {
  @HostBinding('class')
  private classes = 'block py-6 px-8';

  private riskLevelImpactData = [
    ResidualRiskLevelImpactEnum.Empty,
    ResidualRiskLevelImpactEnum.Insignificant,
    ResidualRiskLevelImpactEnum.Minor,
    ResidualRiskLevelImpactEnum.Moderate,
    ResidualRiskLevelImpactEnum.Major,
    ResidualRiskLevelImpactEnum.Catastrophic,
  ];
  private riskLevelLiklihoodData = [
    ResidualRiskLevelLikeHoodEnum.Empty,
    ResidualRiskLevelLikeHoodEnum.Rare,
    ResidualRiskLevelLikeHoodEnum.Unlikely,
    ResidualRiskLevelLikeHoodEnum.Possible,
    ResidualRiskLevelLikeHoodEnum.Likely,
    ResidualRiskLevelLikeHoodEnum.AlmostCertain,
  ];

  registryData: { value: number; text: string; backgroundColor?: string, isHeader?: boolean }[][];

  ngOnInit(): void {
    this.registryData = this.calculateRegistryData();
  }

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.riskAanlysis.${relativeKey}`;
  }

  private calculateRegistryData(): { value: number; text: string; backgroundColor?: string, isHeader?: boolean }[][] {
    const impactArr = this.riskLevelImpactData.map((text: string, i: number) => {
      return { value: i, text, isHeader: true };
    });

    const liklihoodArr = this.riskLevelLiklihoodData.map((text: string, i: number) => {
      return { value: i, text, isHeader: true };
    });

    return liklihoodArr.map((currLiklihood, liklihoodIndex) => {
      if (liklihoodIndex === 0) {
        return impactArr;
      }
      return impactArr.map((currImpact, impactIndex) => {
        if (impactIndex === 0) {
          return currLiklihood;
        }
        const value: number = currImpact.value * currLiklihood.value;
        const text: ResidualRiskLevelEnum = this.getRiskLevelText(value);
        const backgroundColor: string = RiskLevelBGClasses[text];

        return {
          value,
          text,
          backgroundColor,
        };
      });
    });
  }

  private getRiskLevelText(value: number): ResidualRiskLevelEnum {
    switch (true) {
      case value < 5:
        return ResidualRiskLevelEnum.Low;
      case value >= 5 && value <= 10:
        return ResidualRiskLevelEnum.Medium;
      case value > 10 && value < 20:
        return ResidualRiskLevelEnum.High;
      case value >= 20:
        return ResidualRiskLevelEnum.Critical;
      default:
        break;
    }
  }
}
