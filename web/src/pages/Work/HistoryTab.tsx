import * as React from 'react';

import WorkComponent from '../../hocs/WorkComponent';
import { Work } from '../../Interfaces';
import { PoetAPIResourceProvider } from '../../components/atoms/base/PoetApiResource';
import { SelectWorkById } from '../../components/atoms/Arguments';
import moment = require('moment');
import { NotificationEvent } from '../../store/PoetAppState';
import { renderEventMessage } from '../Account/Notifications/Model';

class HistoryList extends PoetAPIResourceProvider<Event[], SelectWorkById, undefined> {
  poetURL(): string {
    return '/events?work=' + this.props.workId
  }

  renderItem(event: NotificationEvent) {
    const text = renderEventMessage(event)
    if (!text) return <span key={event.id}/>
    return <li key={event.id}> { moment(event.timestamp).fromNow() }: { text }</li>
  }

  renderElement(resource: Event[], headers: Headers): JSX.Element {
    return (<ul>
      { resource.map(this.renderItem.bind(this)) }
    </ul>)
  }
}

function render(props: Work): JSX.Element {
  return (
    <div className="historyTab">
      <h1>History</h1>
      <HistoryList workId={props.id} />
    </div>
  )
}

export default WorkComponent(render);