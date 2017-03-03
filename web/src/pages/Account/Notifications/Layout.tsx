import * as React from 'react';
import { NotificationsStore, Notification } from '../../../store/PoetAppState';
import { getEventMessage } from './Model';
import moment = require('moment');

import './Layout.scss'
import { NotificationsActions } from './Loader';

export class NotificationsLayout extends React.Component<NotificationsStore & NotificationsActions, undefined> {

  render() {
    return (
      <section className="container notifications">
        <div className="header">
          <h2>Notifications</h2>
          <div className="page-portfolio">
            <div className="portfolio-works">
              <table>
                <thead>
                  <tr><th></th><th>Time</th><th>Description</th></tr>
                </thead>
                <tbody>
                  { this.props.notifications && this.props.notifications.map(notification => this.drawNotification(notification)) }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }

  markRead(id: number) {
    return () => {
      this.props.markRead(id)
    }
  }

  drawNotification(notification: Notification) {
    return <tr key={notification.id}>
      <td><input type="checkbox"/></td>
      <td>{ moment(notification.event.timestamp).fromNow() }</td>
      <td className={ notification.read ? 'bold' : ''}>
        { getEventMessage(notification.event) }
      </td>
    </tr>
  }
}

