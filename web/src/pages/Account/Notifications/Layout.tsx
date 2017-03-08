import * as React from 'react';
import { NotificationsStore, Notification } from '../../../store/PoetAppState';
import { getEventMessage } from './Model';
import moment = require('moment');

import './Layout.scss'
import { NotificationsActions } from './Loader';

export class NotificationsLayout extends React.Component<NotificationsStore & NotificationsActions, undefined> {

  render() {
    return (
      <section className="container page-account-notifications">
        <h1>Notifications</h1>
        <table>
          <thead>
            <tr>
              <td></td>
              <td>Time</td>
              <td>Description</td>
            </tr>
          </thead>
          <tbody>
            { this.props.notifications && this.props.notifications.map(notification => this.renderNotification(notification)) }
          </tbody>
        </table>
      </section>
    );
  }

  markRead(id: number) {
    return () => {
      this.props.markRead(id)
    }
  }

  renderNotification(notification: Notification) {
    return (
      <tr key={notification.id}>
        <td><input type="checkbox"/></td>
        <td>{ moment(notification.event.timestamp).fromNow() }</td>
        <td className={ notification.read ? 'bold' : ''}>
          { getEventMessage(notification.event) }
        </td>
      </tr>
    )
  }
}

