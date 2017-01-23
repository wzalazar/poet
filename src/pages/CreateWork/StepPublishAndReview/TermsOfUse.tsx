import * as React from 'react';
import { Checkbox } from '../../../components/Checkbox';

import './TermsOfUse.scss';

export interface TermsOfUseProps {
  className?: string;
}

export class TermsOfUse extends React.Component<TermsOfUseProps, undefined> {
  render() {
    return (
      <section className={'terms-of-use ' + this.props.className}>
        <p>I understand that stamping a creative work into the blockchain is an irreversible action.
        By agreeing to this terms I assert that I am the proper owner of this work and I understand that if this is proven wrong
          I wll be penalized by losing 1514 Poet Tokens.
        </p>
        <Checkbox text="I agree to the terms above"/>
      </section>
    );
  }
}