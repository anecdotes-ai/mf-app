import { ConfirmationContext } from './confirmation-context';
import { AccountLinkingContext } from './account-linking-context';

export interface SignInContext {
    accountLinking: AccountLinkingContext;
    confirmation: ConfirmationContext;
}
