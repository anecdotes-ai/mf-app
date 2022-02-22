// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { notificationsEndpoints } from './notifications-endpoints';
import { ConfigurationFile } from 'core';
import { endpoints } from './endpoints';
import { identityEndpoints } from './identity-endpoints';
import { snapshotEndpoints } from './snapshot-endpoints';

const config: ConfigurationFile = {
  internationalization: {
    defaultLanguage: 'en-US',
  },
  firebase: {
    apiKey: 'AIzaSyBHOgRP_ykGTX-D0fSOgiO2Hrw7g_gVryo',
    authDomain: 'anecdotes-dev.firebaseapp.com',
    projectId: 'anecdotes-dev',
  },
  auth: {
    tenantSubDomainFormat: '{{tenant_sub_domain}}',
    tenantRedirectUrlFormat: 'https://{{tenant_sub_domain}}.anecdotes.dev',
    domain: 'anecdotes.dev',
  },
  amplitude: {
    apiKey: '1010a579550def5b05a6f52fec26a6a7',
  },
  api: {
    baseUrl: 'https://api-ythbk5tvfq-uc.a.run.app/v1', // TODO: to revert when the API is merged to dev
    useAuth: true,
    endpoints: endpoints,
  },
  commentsApi: {
    baseUrl: 'https://comments-api-ythbk5tvfq-uc.a.run.app',
  },
  notificationsApi: {
    baseUrl: 'https://notifications-ythbk5tvfq-uc.a.run.app',
    endpoints: notificationsEndpoints,
  },
  identityApi: {
    baseUrl: 'https://identity-ythbk5tvfq-uc.a.run.app/v1',
    endpoints: identityEndpoints,
  },
  snapshotApi: {
    baseUrl: 'https://snapshot-ythbk5tvfq-uc.a.run.app/v1',
    endpoints: snapshotEndpoints,
  },
  slackApi: {
    baseUrl: 'https://slackbot-ythbk5tvfq-uc.a.run.app/v1',
    endpoints: {
      channels: '/slack/channels',
      users: '/slack/users',
      dissmissSlackPendingState: '/slack/{{control_requirement_id}}',
      sendSlackMessage: '/slack/{{control_requirement_id}}',
    },
  },
  pusher: {
    applicationId: 'd36dc2e91adb5069ec04',
    cluster: 'eu',
    authEndpoint: 'pusher/authorize',
  },
  logRocket: {
    projectId: 'd4uzqq/anecdotes',
  },
  gainsight: {
    productKey: 'AP-HYPFUFPXTR2C-2',
  },
  intercom: {
    appId: 'rzpp5uma',
  },
  redirectUrls: {
    anecdotes: 'https://www.anecdotes.ai',
    inactiveUser: 'https://www.anecdotes.ai/inactive-user',
    browserNotSupported: 'https://www.anecdotes.ai/browser-not-supported',
    privacyPage: 'https://www.anecdotes.ai/privacy-policy',
    termsPage: 'https://www.anecdotes.ai/terms-of-use',
    howToConnectPlugins: 'https://intercom.help/anecdotes/en/collections/2701495-plugins',
    howToConfigureAgent: 'https://intercom.help/anecdotes/en/articles/5697228-how-to-configure-anecdotes-connector',
    complienceProgressArticle: 'https://intercom.help/anecdotes/en/articles/5224145-getting-started-controls-page',
    multiAccountsPage: 'https://intercom.help/anecdotes/en/articles/5779617-how-to-connect-multiple-accounts',
    intercomJiraCustomizationHelp:
      'https://intercom.help/anecdotes/en/articles/5067844-how-to-customize-evidence-from-jira-cloud',
    intercomZendeskCustomizationHelp:
      'https://intercom.help/anecdotes/en/articles/5365221-how-to-customize-evidence-from-zendesk',
    auditorsPortal: 'https://auditors.anecdotes.dev',
  },
  pdfTron: {
    licenseKey:
      'anecdotes A.I Ltd(anecdotes.ai):OEM:anecdotes::B+:AMS(20220607):0EB5005204E7060A7360B13AC982537860617FDBDF504E7B0412BC0B8D5430B622DA35F5C7',
  },
  apm: {
    serviceName: 'frontend',
    env: 'dev',
    baseUrl: 'https://55b2ca3b393a4f85b61f88eff8914232.apm.us-central1.gcp.cloud.es.io',
  },
};

export const environment = {
  production: false,
  config,
  configName: 'config.json',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
