import * as React from 'react';

import { NotificationEvent } from '../../../store/PoetAppState';
import { WorkNameWithLinkById } from '../../../components/atoms/Work';
import { ProfileNameWithLink } from '../../../components/atoms/Profile';

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

export const renderEventMessage = (event: NotificationEvent) => {
  switch (event.type) {
    case EventType.WORK_CREATED:
      return 'Creative work registered by ' + event.actorDisplayName;
    case EventType.PROFILE_CREATED:
      return event.actorDisplayName + ' created a public profile';
    case EventType.TITLE_ASSIGNED:
      return <span>Title for <WorkNameWithLinkById workId={event.workId} >{event.workDisplayName}</WorkNameWithLinkById> assigned to <ProfileNameWithLink profileId={event.actorId} >{event.actorDisplayName}</ProfileNameWithLink></span>;
    case EventType.LICENSE_OFFERED:
      return 'License offered for ' + event.workDisplayName + ' by ' + event.actorDisplayName;
    case EventType.LICENSE_BOUGHT:
      return 'License bought for ' + event.workDisplayName + ' by ' + event.actorDisplayName;
    default:
      return null
  }
};
