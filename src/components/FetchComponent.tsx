import * as React from "react";
import { connect } from 'react-redux';

import Actions from '../actions';

type RequestParams = (props: any) => FetchRequestParams;
type Render = (props: any) => JSX.Element;

interface FetchRequestParams {
  url: string;
}

export interface FetchComponentProps {
  dispatchRequest: (payload: any) => void
  error: any
  loading: any
  requestParams: RequestParams
  render: Render
}

class FetchComponent<T extends FetchComponentProps, S> extends React.Component<T, S> {

  componentWillMount() {
    this.fetchIfNeeded(this.props);
  }

  componentWillReceiveProps(newProps: T) {
    this.fetchIfNeeded(newProps);
  }

  fetchIfNeeded(props: T) {
    if (!props.loading && !props.error) {
      props.dispatchRequest(this.props.requestParams(props));
    }
  }

  renderLoading() {
    return <span>Loading...</span>;
  }

  renderError() {
    return <span>{this.props.error}</span>;
  }

  render() {
    if (this.props.loading) {
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
  return {
    ...data, ...ownProps, requestParams, render
  };
}

export default (requestParams: RequestParams, render: Render) =>
  connect(mapStateToProps.bind(null, requestParams, render), {
    dispatchRequest: (payload) => ({ type: Actions.fetchRequest, payload })
  })(FetchComponent);