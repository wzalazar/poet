import * as React from 'react';

import WorkComponent from '../../hocs/WorkComponent';
import { Work } from '../../atoms/Interfaces';
import { PoetAPIResourceProvider } from '../../atoms/base/PoetApiResource';
import { SelectWorkById } from '../../atoms/Arguments';
import moment = require('moment');

export enum EventType {
  WORK_CREATED,
  PROFILE_CREATED,
  TITLE_ASSIGNED,
  TITLE_REVOKED,
  LICENSE_OFFERED,
  LICENSE_BOUGHT,
  LICENSE_SOLD,
  WORK_MODIFIED,
  WORK_TRANSFERRED,
  BLOCKCHAIN_STAMP,
}

interface Event {
  id: number,
  type: EventType,
  timestamp: number,
  actorId: string,
  actorDisplayName: string,
  workId: string,
  workDisplayName: string
}

const message = (event: Event) => {
  switch (event.type) {
    case EventType.WORK_CREATED:
      return 'Creative work registered by ' + event.actorDisplayName
    case EventType.PROFILE_CREATED:
      return event.actorDisplayName + ' created a public profile'
    case EventType.TITLE_ASSIGNED:
      return 'Title for ' + event.workDisplayName + ' assigned to ' + event.actorDisplayName
    case EventType.LICENSE_OFFERED:
      return 'License offered for ' + event.workDisplayName + ' by ' + event.actorDisplayName
    case EventType.LICENSE_BOUGHT:
      return 'License bought for ' + event.workDisplayName + ' by ' + event.actorDisplayName
    default:
      return null
  }
}

class HistoryList extends PoetAPIResourceProvider<Event[], SelectWorkById, undefined> {
  poetURL(): string {
    return '/events?work=' + this.props.workId
  }

  renderItem(event: Event) {
    const text = message(event)
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