import { EvidenceTypeEnum } from 'core/modules/data/models/domain';

export const EvidenceTypeIconMapping = {
  [EvidenceTypeEnum.CONFIGURATION]: {
    icon: 'CFG',
  },
  [EvidenceTypeEnum.DOCUMENT]: {
    icon: 'DOC',
  },
  [EvidenceTypeEnum.LIST]: {
    icon: 'List',
  },
  [EvidenceTypeEnum.LOG]: {
    icon: 'LOG',
  },
  [EvidenceTypeEnum.APP]: {
    icon: 'APP',
  },
  [EvidenceTypeEnum.UNKNOWN]: {
    icon: 'UNKNOWN',
  },
  [EvidenceTypeEnum.LINK]: {
    icon: 'DOC',
  },
  [EvidenceTypeEnum.MANUAL]: {
    icon: 'FILE',
  },
  [EvidenceTypeEnum.URL]: {
    icon: 'URL',
  },
  [EvidenceTypeEnum.TICKET]: {
    icon: 'LOG',
  },
};
