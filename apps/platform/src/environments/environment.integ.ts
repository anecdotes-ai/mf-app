import { ConfigurationFile } from 'core';
import { endpoints } from './endpoints';
import { identityEndpoints } from './identity-endpoints';
import { snapshotEndpoints } from './snapshot-endpoints';
import { notificationsEndpoints } from './notifications-endpoints';

const config: ConfigurationFile = {
  internationalization: {
    defaultLanguage: 'en-US',
  },
  auth: {
    tenantSubDomainFormat: '{{tenant_sub_domain}}',
    tenantRedirectUrlFormat: 'https://{{tenant_sub_domain}}.anecdotes.dev',
    domain: 'anecdotes.dev',
  },
  firebase: {
    apiKey: 'AIzaSyDblcJhh4niqgzaiSBlZ-I-KWyRZajfVe0',
    authDomain: 'anecdotes-integration.firebaseapp.com',
    projectId: 'anecdotes-integration',
  },
  amplitude: {
    apiKey: '1010a579550def5b05a6f52fec26a6a7',
  },
  api: {
    baseUrl: 'https://api-gva4u245sq-uc.a.run.app/v1',
    useAuth: true,
    endpoints: endpoints,
  },
  notificationsApi: {
    baseUrl: 'https://notifications-gva4u245sq-uc.a.run.app',
    endpoints: notificationsEndpoints,
  },
  commentsApi: {
    baseUrl: 'https://comments-api-gva4u245sq-uc.a.run.app',
  },
  identityApi: {
    baseUrl: 'https://identity-gva4u245sq-uc.a.run.app/v1',
    endpoints: identityEndpoints,
  },
  snapshotApi: {
    baseUrl: 'https://snapshot-gva4u245sq-uc.a.run.app/v1',
    endpoints: snapshotEndpoints,
  },
  slackApi: {
    baseUrl: 'https://slackbot-gva4u245sq-uc.a.run.app/v1',
    endpoints: {
      channels: '/slack/channels',
      users: '/slack/users',
      dissmissSlackPendingState: '/slack/{{control_requirement_id}}',
      sendSlackMessage: '/slack/{{control_requirement_id}}',
    },
  },
  pusher: {
    applicationId: '9a476fcc6f0431052f67',
    cluster: 'eu',
    authEndpoint: 'pusher/authorize',
  },
  logRocket: {
    projectId: 'd4uzqq/anecdotes',
  },
  userflow: {
    token: 'ct_zd2qz3rqufcztjgz6ibx2i4r3i',
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
    auditorsPortal: 'https://auditors-integ.anecdotes.dev',
  },
  pdfTron: {
    licenseKey:
      'anecdotes A.I Ltd(anecdotes.ai):OEM:anecdotes::B+:AMS(20220607):0EB5005204E7060A7360B13AC982537860617FDBDF504E7B0412BC0B8D5430B622DA35F5C7',
  },
  apm: {
    serviceName: 'frontend',
    env: 'stage',
    baseUrl: 'https://55b2ca3b393a4f85b61f88eff8914232.apm.us-central1.gcp.cloud.es.io',
  },
};

export const environment = {
  production: false,
  config,
  configName: 'config.json',
};
