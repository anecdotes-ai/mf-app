export interface MultiselectingItem<T = any> {
    text?: string;
    translationKey?: string;
    data?: T;
    arrayData?: T[];
    icon?: string;
    selected?: boolean;
}
