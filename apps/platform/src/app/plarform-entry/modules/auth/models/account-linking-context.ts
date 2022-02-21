import firebase from 'firebase/app';

export interface AccountLinkingContext {
    email: string;
    credential: firebase.auth.AuthCredential;
    currentIdpId: string;
}
