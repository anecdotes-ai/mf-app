export const TicketingModalsCommonTranslationRootKey = 'ticketingModals';

export const baseModalConfigData = {
    titleKey: `${TicketingModalsCommonTranslationRootKey}.title`,
    descriptionKey: `${TicketingModalsCommonTranslationRootKey}.description`,
};

export function buildTranslationKeyByTicketingRoot(key: string): string {
    return `${TicketingModalsCommonTranslationRootKey}.${key}`;
}
