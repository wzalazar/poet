import * as React from 'react';
import { Route } from 'react-router';
import { delay, takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import { Claim } from '../../../Claim';
import { Actions } from '../../../actions/index'
import PageLoader, { ReducerDescription } from '../../../components/PageLoader';

import { NotificationsLayout } from './Layout';
import { NotificationsStore, Notification } from '../../../store/PoetAppState';
import { selectNotifications } from '../../../selectors/session';

export interface NotificationsActions {
  markRead: (id: number) => ({ type: null })
}

export class NotificationsPage extends PageLoader<NotificationsStore, Object> {

  component = NotificationsLayout;

  initialState() {
    return { notifications: [] as ReadonlyArray<Notification>, unreadCount: 0, totalCount: 0 };
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
    return selectNotifications(state)
  }

  mapDispatchToProps(): Object {
    return {}
  }
}
