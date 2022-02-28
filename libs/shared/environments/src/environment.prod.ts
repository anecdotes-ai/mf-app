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
    tenantRedirectUrlFormat: 'https://{{tenant_sub_domain}}.anecdotes.ai',
    domain: 'anecdotes.ai',
  },
  firebase: {
    apiKey: 'AIzaSyAZw4KVbj7DgdpWFr9cBgJYsRNWm3yv3sw',
    authDomain: 'anecdotes-production.firebaseapp.com',
    projectId: 'anecdotes-production',
  },
  amplitude: {
    apiKey: '9a84231244e44fd3aa8c2f17ef59004e',
  },
  notificationsApi: {
    baseUrl: 'https://notifications.anecdotes.ai',
    endpoints: notificationsEndpoints,
  },
  api: {
    baseUrl: 'https://api.anecdotes.ai/v1',
    useAuth: true,
    endpoints: endpoints,
  },
  commentsApi: {
    baseUrl: 'https://comments-api.anecdotes.ai',
  },
  identityApi: {
    baseUrl: 'https://identity.anecdotes.ai/v1',
    endpoints: identityEndpoints,
  },
  snapshotApi: {
    baseUrl: 'https://snapshot.anecdotes.ai/v1',
    endpoints: snapshotEndpoints,
  },
  slackApi: {
    baseUrl: 'https://slackbot.anecdotes.ai/v1',
    endpoints: {
      channels: '/slack/channels',
      users: '/slack/users',
      dissmissSlackPendingState: '/slack/{{control_requirement_id}}',
      sendSlackMessage: '/slack/{{control_requirement_id}}',
    },
  },
  pusher: {
    applicationId: '33a41e46153be67c37b9',
    cluster: 'us2',
    authEndpoint: 'pusher/authorize',
  },
  logRocket: {
    projectId: 'd4uzqq/anecdotes-prod',
  },
  userflow: {
    token: 'ct_5agm4abydjfunmk53yh3uz63hm',
  },
  intercom: {
    appId: 'xak09iin',
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
    auditorsPortal: 'https://auditors.anecdotes.ai',
  },
  pdfTron: {
    licenseKey:
      'anecdotes A.I Ltd(anecdotes.ai):OEM:anecdotes::B+:AMS(20220607):0EB5005204E7060A7360B13AC982537860617FDBDF504E7B0412BC0B8D5430B622DA35F5C7',
  },
  apm: {
    serviceName: 'frontend',
    env: 'prod',
    baseUrl: 'https://55b2ca3b393a4f85b61f88eff8914232.apm.us-central1.gcp.cloud.es.io',
  },
};

export const environment = {
  production: true,
  config,
  configName: 'config.json',
};
