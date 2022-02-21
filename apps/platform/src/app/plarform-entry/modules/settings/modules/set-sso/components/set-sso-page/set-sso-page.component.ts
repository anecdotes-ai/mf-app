import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { IDPTypes } from 'core/modules/auth-core/models/domain';
import { SamlFacadeService } from 'core/modules/auth-core/services';
import { ComponentToSwitch } from 'core/modules/component-switcher';
import { BehaviorSubject } from 'rxjs';
import { SelectedItemToSetSSO, SetSSOModalsIds, SetSSOSharedContext, translationRootKey } from '../../models';
import { DisconnectConfirmationComponent } from '../disconnect-confirmation/disconnect-confirmation.component';
import { SsoConnectionSuccessComponent } from '../sso-connection-success/sso-connection-success.component';
import { SsoConnectionComponent } from '../sso-connection/sso-connection.component';

@Component({
  selector: 'app-set-sso-page',
  templateUrl: './set-sso-page.component.html',
  styleUrls: ['./set-sso-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetSsoPageComponent implements OnInit {
  @HostBinding('class')
  private classes = 'flex flex-column font-main h-full relative';

  readonly IDPTypeToNameMapper = {
    [IDPTypes.Okta]: 'Okta',
    [IDPTypes.OneLogin]: 'One Login',
    [IDPTypes.Auth0]: 'Auth0',
  };

  samlItemsToDisplay: SelectedItemToSetSSO[];

  componentsToSwitch: ComponentToSwitch[];
  ssoContext: SetSSOSharedContext;
  loading$ = new BehaviorSubject<boolean>(undefined);

  constructor(private samlFacade: SamlFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initAsync();
  }

  buildTranslationKey(relativeKey: string): string {
    return `${translationRootKey}.${relativeKey}`;
  }

  setSso(samlItem: SelectedItemToSetSSO): void {
    this.createComponentsToSwitch(samlItem);
  }

  editSso(samlItem: SelectedItemToSetSSO): void {
    this.createComponentsToSwitch(samlItem);
    this.cd.detectChanges();
  }

  close(): void {
    this.componentsToSwitch = null;
    this.cd.detectChanges();
  }

  private async initAsync(): Promise<void> {
    this.loading$.next(true);
    await this.refreshSamlItemsAsync();
    this.loading$.next(false);
  }

  private async refreshSamlItemsAsync(): Promise<void> {
    const samlEntities =  await this.samlFacade.getSAMLIds();
    this.samlItemsToDisplay = this.initSamlItemsToDisplay();
    this.samlItemsToDisplay.forEach(vm => {
      const samlEntity = samlEntities.find(x => x.idp_type === vm.type);
      vm.link = samlEntity?.idp_metadata_url;
      vm.idp_id = samlEntity?.idp_id;
    });
  }

  private createComponentsToSwitch(samlItem: SelectedItemToSetSSO): void {
    this.componentsToSwitch = [
      {
        id: SetSSOModalsIds.SetSSOLink,
        componentType: SsoConnectionComponent
      },
      {
        id: SetSSOModalsIds.SuccesscfullySetteledSSO,
        componentType: SsoConnectionSuccessComponent
      },
      {
        id: SetSSOModalsIds.RemoveLinkConfirmation,
        componentType: DisconnectConfirmationComponent
      }
    ];

    this.ssoContext = {
      selectedItemToSetSSO: samlItem,
      translationKey: '',
      setCallBack: () => this.setCallback(),
      disconnectCallBack: () => this.disconnectCallback(),
      closeCallback: () => this.close()
    };
  }

  private async setCallback(): Promise<void> {
    await this.refreshSamlItemsAsync();
    this.cd.detectChanges();
  }

  private async disconnectCallback(): Promise<void> {
    await this.refreshSamlItemsAsync();
    this.cd.detectChanges();
  }

  private initSamlItemsToDisplay(): SelectedItemToSetSSO[] {
    return [
      {
        type: IDPTypes.Okta,
        displayName: this.IDPTypeToNameMapper[IDPTypes.Okta],
        articleLink: 'https://intercom.help/anecdotes/en/articles/5439449-how-to-configure-okta-saml-2-0-to-anecdotes',
      },
      {
        type: IDPTypes.OneLogin,
        displayName: this.IDPTypeToNameMapper[IDPTypes.OneLogin],
        articleLink: 'https://intercom.help/anecdotes/en/articles/5460789-how-to-configure-onelogin-saml-2-0-for-anecdotes',
      },
      {
        type: IDPTypes.Auth0,
        displayName: this.IDPTypeToNameMapper[IDPTypes.Auth0],
        comingSoon: true,
      },
    ];
  }
}
