import { ConfigurationFile } from 'core';
import { endpoints } from './endpoints';
import { identityEndpoints } from './identity-endpoints';
import { snapshotEndpoints } from './snapshot-endpoints';

const config: ConfigurationFile = {
  internationalization: {
    defaultLanguage: 'en-US',
  },
  firebase: {
    apiKey: '~IDP_API_KEY~',
    authDomain: '~GCP_PROJECT~.firebaseapp.com',
    projectId: '~GCP_PROJECT~',
  },
  auth: {
    tenantSubDomainFormat: '{{tenant_sub_domain}}',
    tenantRedirectUrlFormat: 'https://{{tenant_sub_domain}}.~DOMAIN_NAME~',
    domain: '~DOMAIN_NAME~',
  },
  slackApi: {
    baseUrl: '~SLACKBOT_SERVICE_URL~/v1',
    endpoints: {
      channels: 'slack/channels',
      users: 'slack/users',
      dissmissSlackPendingState: '/slack/{{control_requirement_id}}',
      sendSlackMessage: '/slack/{{control_requirement_id}}',
    },
  },
  amplitude: {
    apiKey: '1010a579550def5b05a6f52fec26a6a7',
  },
  api: {
    baseUrl: '~API_SERVICE_URL~/v1',
    useAuth: true,
    endpoints: endpoints,
  },
  identityApi: {
    baseUrl: '~IDENTITY_SERVICE_URL~/v1',
    endpoints: identityEndpoints,
  },
  snapshotApi: {
    baseUrl: '~SNAPSHOT_SERVICE_URL~/v1',
    endpoints: snapshotEndpoints,
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
    multiAccountsPage: 'https://intercom.help/anecdotes/en/articles/5779617-how-to-connect-multiple-accounts',
    complienceProgressArticle: 'https://intercom.help/anecdotes/en/articles/5224145-getting-started-controls-page',
    intercomJiraCustomizationHelp:
      'https://intercom.help/anecdotes/en/articles/5067844-how-to-customize-evidence-from-jira-cloud',
    intercomZendeskCustomizationHelp:
      'https://intercom.help/anecdotes/en/articles/5365221-how-to-customize-evidence-from-zendesk',
    intercomJiraServerCustomizationHelp:
      'https://intercom.help/anecdotes/en/articles/5920608-how-to-customize-evidence-from-jira-server',
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
