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
      return <span>Creative work registered by <ProfileNameWithLink profileId={event.actorId} >{event.actorDisplayName}</ProfileNameWithLink></span>;
    case EventType.PROFILE_CREATED:
      return <span><ProfileNameWithLink profileId={event.actorId} >{event.actorDisplayName}</ProfileNameWithLink> created a public profile</span>;
    case EventType.TITLE_ASSIGNED:
      return <span>Title for <WorkNameWithLinkById workId={event.workId} >{event.workDisplayName}</WorkNameWithLinkById> assigned to <ProfileNameWithLink profileId={event.actorId} >{event.actorDisplayName}</ProfileNameWithLink></span>;
    case EventType.LICENSE_OFFERED:
      return <span>License offered for <WorkNameWithLinkById workId={event.workId} >{event.workDisplayName}</WorkNameWithLinkById> by <ProfileNameWithLink profileId={event.actorId} >{event.actorDisplayName}</ProfileNameWithLink></span>;
    case EventType.LICENSE_BOUGHT:
      return <span>License bought for <WorkNameWithLinkById workId={event.workId} >{event.workDisplayName}</WorkNameWithLinkById> by <ProfileNameWithLink profileId={event.actorId} >{event.actorDisplayName}</ProfileNameWithLink></span>;
    default:
      return null
  }
};
