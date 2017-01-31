import * as React from 'react';
import { connect } from 'react-redux';

import Actions from '../actions';
import { FetchStatus } from '../enums/FetchStatus';

type RequestParams = (props: any) => FetchRequestParams;
type Render = (props: any) => JSX.Element;

interface FetchRequestParams {
  url: string;
}

export interface FetchComponentProps {
  dispatchRequest: (payload: any) => void;
  error: any;
  status: FetchStatus;
  requestParams: RequestParams;
  render: Render;
  elements: any;
}

class FetchComponent<T extends FetchComponentProps, S> extends React.Component<T, S> {

  componentWillMount() {
    this.dispatchRequest(this.props);
  }

  componentWillReceiveProps(newProps: T) {
    this.dispatchRequest(newProps);
  }

  private dispatchRequest(props: T) {
    if (props.status == FetchStatus.Uninitialized)
      props.dispatchRequest(this.props.requestParams(props));
  }

  renderLoading() {
    return <span>Loading...</span>;
  }

  renderError() {
    return <span>{this.props.error}</span>;
  }

  render() {
    if (this.props.status == FetchStatus.Uninitialized || this.props.status == FetchStatus.Loading) {
      return this.renderLoading();
    }
    if (this.props.error) {
      return this.renderError();
    }
    return this.props.render(this.props);
  }

}

function mapStateToProps(requestParams: RequestParams, render: Render, state: any, ownProps: any) {
  const url = requestParams(ownProps).url;
  const data = state.fetch && state.fetch[url];
  const body = data && data.body;
  const status = data && data.status || FetchStatus.Uninitialized;

  if (Array.isArray(body)) {
    return {
      elements: body, ...ownProps, requestParams, render, status
    };
  }

  return {
    ...body, ...ownProps, requestParams, render, status
  };
}

const mapDispatch = {
  dispatchRequest: (payload: any) => ({ type: Actions.fetchRequest, payload })
};

export default (requestParams: RequestParams, render: Render) =>
  connect(mapStateToProps.bind(null, requestParams, render), mapDispatch)(FetchComponent);