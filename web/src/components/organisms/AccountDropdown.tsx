import * as React from 'react';
import { browserHistory } from 'react-router';
import { Action } from 'redux';
import { connect } from "react-redux";

import { Images } from '../../images/Images';
import { Actions } from '../../actions/index';
import { DropdownMenu } from '../molecules/DropdownMenu';

import { WalletBalance } from '../../atoms/WalletBalance';
import { currentPublicKey } from '../../selectors/session';
import { publicKeyToAddress } from '../../bitcoin/addressHelpers';

import './AccountDropDown.scss';

interface AccountDropdownProps {
  readonly avatar?: string;
  readonly displayName?: string;
  readonly walletAddress?: string;
  readonly logout?: () => Action;
}

function AccountDropdownComponent(props: AccountDropdownProps) {
  return (
    <DropdownMenu className="account-dropdown-menu">
      <img key="avatar" src={props.avatar || Images.Anon } className="rounded-circle" />
      <ul>
        <li className="inactive">Signed in as {props.displayName}</li>
        <li onClick={() => browserHistory.push('/account/notifications')}>Notifications</li>
        <li onClick={() => browserHistory.push('/account/wallet')} className="wallet"><span>Wallet</span><WalletBalance address={props.walletAddress} className="balance" /></li>
        <li onClick={() => browserHistory.push('/account/profile')}>Profile</li>
        <li onClick={props.logout} className="log-out">Log Out</li>
      </ul>
    </DropdownMenu>
  );
}

function mapStateToProps(state: any, ownProps: AccountDropdownProps): AccountDropdownProps {
  const publicKey = currentPublicKey(state);
  const walletAddress = publicKey && publicKeyToAddress(publicKey);

  return {
    ...ownProps,
    displayName: state.profile.displayName,
    walletAddress,
    avatar: state.profile && state.profile.attributes && state.profile.attributes.imageData,
  };
}

const mapDispatch = {
  logout: () => ({ type: Actions.Session.LogoutButtonClicked })
};

export const AccountDropdown = connect(mapStateToProps, mapDispatch)(AccountDropdownComponent);