export const ConfirmMultipleAccountsConnectionInputKeys = {
    accountsToBeConnected: 'accountsToBeConnected',
    connectAccountsHandler: 'connectAccountsHandler'
};

export interface ConfirmationModalWindowContext {
    [ConfirmationModalWindowContextInputKeys.accountsToBeConnected]?: string[];
    [ConfirmationModalWindowContextInputKeys.connectAccountsHandler]?: () => any;

}

// This enum should duplicate ConfirmationModalWindowInputKeys
export enum ConfirmationModalWindowContextInputKeys {
    accountsToBeConnected = 'accountsToBeConnected',
    connectAccountsHandler = 'connectAccountsHandler'
}
