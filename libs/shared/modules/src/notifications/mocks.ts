import { Notification, NotificationResourceType, NotificationState } from './models';

export const mockNotification: Notification = {
  id: 'fakeNotification1',
  content: 'Inbar Dor tagged you in a comment',
  creation_time: 'Sun Dec 05 2021 15:05:51 GMT+0200 (Israel Standard Time)',
  state: NotificationState.New,
  data: {
    resource_id: 'b6aaa009-69b3-4f5c-863a-763dfb3334f5',
    resource_type: NotificationResourceType.Thread,
    extraParams: {
      path: ['SOC 2', 'Board of director- bla bla bla'],
      url: 'http://localhost:9876/frameworks/SOC%202/controls',
    },
  },
};

export const mockNotifications: Notification[] = [
  {
    id: 'bla4',
    content: 'Juliet Rosenblum replied to your comment',
    creation_time: 'Sun Dec 05 2021 13:05:00 GMT+0200 (Israel Standard Time)',
    state: NotificationState.Seen,
    data: {
      resource_id: '77422723-09ca-4320-9e64-292bba0bf747',
      extraParams: {
        path: ['SOC 2', 'Changes are communicated to users'],
        url: 'http://localhost:4200/frameworks/SOC%202/controls',
      },
    },
  },
  {
    id: 'bla3',
    content: 'Barak Alkalay replied to your comment',
    creation_time: 'Sun Dec 05 2021 12:05:51 GMT+0200 (Israel Standard Time)',
    state: NotificationState.New,
    data: {
      resource_type: NotificationResourceType.Thread,
      resource_id: '2b5d9d7e-bf29-42e3-853c-9a8b84e15eec',
      extraParams: {
        path: ['SOC 2', 'AAA'],
        url: 'http://localhost:4200/frameworks/SOC%202/controls',
      },
    },
  },
  {
    id: 'bla1',
    content: 'Barak Alkalay added a new comment',
    creation_time: 'Fri Dec 03 2021 12:05:51 GMT+0200 (Israel Standard Time)',
    state: NotificationState.Seen,
    data: {
      resource_type: NotificationResourceType.Thread,
      resource_id: '2cea8829-b974-4c72-af84-e464a40a6b74',
      extraParams: {
        path: ['SOC 2', 'Risk assessment process'],
        url: 'http://localhost:4200/frameworks/SOC%202/controls',
      },
    },
  },
];

export const notSortedMockNotifications: Notification[] = [...mockNotifications, mockNotification];

export const sortedMockNotifications: Notification[] = [mockNotification, ...mockNotifications];
