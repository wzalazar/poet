import * as React from 'react';
import { Route } from 'react-router';

import PageLoader, { ReducerDescription } from '../../../components/PageLoader';
import { NotificationsStore, Notification } from '../../../store/PoetAppState';
import {  selectNotifications } from '../../../selectors/session';
import { Actions } from '../../../actions/index';
import { NotificationsLayout } from './Layout';

export interface NotificationsActions {
  readonly markRead: (notifications: ReadonlyArray<number>) => void;
}

export class NotificationsPage extends PageLoader<NotificationsStore, Object> {

  component = NotificationsLayout;

  initialState(): NotificationsStore {
    return {
      notifications: [] as ReadonlyArray<Notification>,
      unreadCount: 0,
      totalCount: 0
    };
  }

  routeHook(key: string) {
    return [<Route path="/account/notifications" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<null> {
    return null;
  }

  sagaHook(): any {
    return null
  }

  select(state: any, ownProps: any): Object {
    return selectNotifications(state)|| {}
  }

  mapDispatchToProps(): NotificationsActions {
    return {
      markRead: (notifications: ReadonlyArray<number>) => ({ type: Actions.Notifications.MarkAllAsRead, notifications })
    }
  }
}
