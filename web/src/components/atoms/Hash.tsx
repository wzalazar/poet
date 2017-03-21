import * as React from 'react';

import { ClassNameProps } from '../../common';
import { CopyableText } from './CopyableText';

import './Hash.scss';

export const Hash = (props: ClassNameProps & {children?: any}) => (
  <CopyableText text={props.children.toString()} className={props.className} >{props.children.toString().firstAndLastCharacters(6)}</CopyableText>
);