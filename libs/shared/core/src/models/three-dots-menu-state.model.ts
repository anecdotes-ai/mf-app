export interface ThreeDotsMenuState {
  showMenu?: boolean;
  menuItemsStates: MenuItemState[];
}

export interface MenuItemState {
  disable?: boolean;
  visibility: boolean;
  itemName: string;
  translationKey: string;
  onClick: () => void;
}
