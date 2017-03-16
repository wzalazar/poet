import * as React from 'react';
import moment = require('moment');

import { NotificationsStore, Notification } from '../../../store/PoetAppState';
import { renderEventMessage } from './Model';
import { NotificationsActions } from './Loader';

import './Layout.scss'

export class NotificationsLayout extends React.Component<NotificationsStore & NotificationsActions, undefined> {

  render() {
    return (
      <section className="container page-account-notifications">
        <h1>Notifications</h1>
        <table>
          <tbody>
            { this.props.notifications && this.props.notifications.map(this.renderNotification) }
          </tbody>
        </table>
      </section>
    );
  }

  renderNotification = (notification: Notification) => {
    return (
      <tr key={notification.id} className={ notification.read ? 'read' : ''} >
        <td className="message">{ renderEventMessage(notification.event) }</td>
        <td className="datetime">{ moment(notification.event.timestamp).fromNow() }</td>
      </tr>
    )
  }
}

