import { TagsColorClasses, TagsColorDefaultClasses } from 'core/constants';
import { ResidualRiskLevelImpactEnum, ResidualRiskLevelLikeHoodEnum, ResidualRiskLevelEnum } from 'core/modules/risk/models';

export const ImpactBGClasses = {
  [ResidualRiskLevelImpactEnum.Insignificant]: TagsColorClasses.BLUE,
  [ResidualRiskLevelImpactEnum.Minor]: TagsColorClasses.LIGHT_ORANGE,
  [ResidualRiskLevelImpactEnum.Moderate]: TagsColorClasses.DARK_ORANGE,
  [ResidualRiskLevelImpactEnum.Major]: TagsColorClasses.PINK,
  [ResidualRiskLevelImpactEnum.Catastrophic]: TagsColorClasses.RED,
};

export const LiklihoodBGClasses = {
  [ResidualRiskLevelLikeHoodEnum.Rare]: TagsColorClasses.BLUE,
  [ResidualRiskLevelLikeHoodEnum.Unlikely]: TagsColorClasses.LIGHT_ORANGE,
  [ResidualRiskLevelLikeHoodEnum.Possible]: TagsColorClasses.DARK_ORANGE,
  [ResidualRiskLevelLikeHoodEnum.Likely]: TagsColorClasses.PINK,
  [ResidualRiskLevelLikeHoodEnum.AlmostCertain]: TagsColorClasses.RED,
};

export const RiskLevelBGClasses = {
  [ResidualRiskLevelEnum.Low]: TagsColorDefaultClasses.BLUE,
  [ResidualRiskLevelEnum.Medium]: TagsColorDefaultClasses.LIGHT_ORANGE,
  [ResidualRiskLevelEnum.High]: TagsColorDefaultClasses.PINK,
  [ResidualRiskLevelEnum.Critical]: TagsColorDefaultClasses.RED,
  [ResidualRiskLevelEnum.NotSet]: TagsColorDefaultClasses.GRAY
};

export const RiskLevelTargetBGClasses = {
  [ResidualRiskLevelEnum.Low]: TagsColorClasses.BLUE,
  [ResidualRiskLevelEnum.Medium]: TagsColorClasses.LIGHT_ORANGE,
  [ResidualRiskLevelEnum.High]: TagsColorClasses.PINK,
  [ResidualRiskLevelEnum.Critical]: TagsColorClasses.RED,
  [ResidualRiskLevelEnum.Empty]: TagsColorClasses.GRAY
};

export const NOT_SET = 'NOT_SET';
export const notSetClass = TagsColorClasses.GRAY;
export const notSetDefaultClass = TagsColorDefaultClasses.GRAY;
