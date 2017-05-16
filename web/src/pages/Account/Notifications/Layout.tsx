import * as React from 'react';
import moment = require('moment');
import * as classNames from 'classnames';
import { Headers } from 'poet-js'

import { Configuration } from '../../../configuration';
import { NotificationsStore, Notification } from '../../../store/PoetAppState';
import { PoetAPIResourceProvider } from '../../../components/atoms/base/PoetApiResource';
import { Pagination } from '../../../components/molecules/Pagination';
import { renderEventMessage } from './Model';

import './Layout.scss'

export interface NotificationsLayoutProps {
  readonly sessionPublicKey: string;
}

export interface NotificationsActions {
  readonly markRead: (notifications: ReadonlyArray<number>) => void;
}

interface NotificationsLayoutState {
  readonly paginationOffset?: number;
}

export class NotificationsLayout extends PoetAPIResourceProvider<ReadonlyArray<Notification>, NotificationsLayoutProps & NotificationsActions, NotificationsLayoutState> {
  private readonly paginationLimit = Configuration.pagination.limit;
  private latestNotifications: ReadonlyArray<Notification>;
  private latestNotificationCount: number;

  constructor() {
    super(...arguments);
    this.state = {
      paginationOffset: 0
    }
  }

  poetURL() {
    return {
      url: '/notifications/' + this.props.sessionPublicKey,
      query: {
        limit: this.paginationLimit,
        offset: this.state.paginationOffset
      }
    };
  }

  renderElement(notifications: ReadonlyArray<Notification>, headers: Headers) {
    const totalCount = headers.get(Headers.TotalCount) && parseInt(headers.get(Headers.TotalCount));
    const unread = headers.get(Headers.Unread) && parseInt(headers.get(Headers.Unread));

    this.latestNotifications = notifications;
    this.latestNotificationCount = totalCount;

    return this.renderNotifications(notifications, totalCount);
  }

  renderLoading() {
    return this.renderNotifications(this.latestNotifications, this.latestNotificationCount, true);
  }

  componentDidMount() {
    document.title = 'Notifications';
  }

  componentWillUnmount() {
    document.title = 'Poet'
  }

  componentDidFetch(notifications: ReadonlyArray<Notification>, headers: Headers) {
    this.props.markRead(notifications.map(_ => _.id));
  }

  private renderNotifications(notifications: ReadonlyArray<Notification>, totalCount: number, isLoading: boolean = false) {
    return (
      <section className={classNames('container', 'page-account-notifications', isLoading && 'loading')}>
        <h1>Notifications</h1>
        <table>
          <tbody>
          { notifications && notifications.map(this.renderNotification) }
          </tbody>
        </table>
        { totalCount && totalCount > 5 && <Pagination
          count={totalCount}
          limit={this.paginationLimit}
          offset={this.state.paginationOffset}
          visiblePageCount={Configuration.pagination.visiblePageCount}
          onClick={this.onPagination}
          disabledClassName="disabled"
          className="pagination" /> }
      </section>
    );
  }

  private renderNotification = (notification: Notification) => {
    return (
      <tr key={notification.id} className={ notification.read && 'read'} >
        <td className="message">{ renderEventMessage(notification.event) }</td>
        <td className="datetime">{ moment(notification.event.timestamp).fromNow() }</td>
      </tr>
    )
  };

  private onPagination = (paginationOffset: number) => this.setState({ paginationOffset });

}

