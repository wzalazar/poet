import { NotificationEvent } from '../../../store/PoetAppState';

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

export const getEventMessage = (event: NotificationEvent) => {
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
