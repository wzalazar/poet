import * as React from "react";
import Actions from '../actions';
import { connect } from 'react-redux';

export type ApiParamsFn = (props: any) => ApiRequestParams;
export type RenderFn = (props: any) => JSX.Element;

export interface ApiRequestParams {
  url: string;
}

export interface ApiComponentProps {
  error: any
  loading: any
  apiParamsFn: ApiParamsFn
  draw: RenderFn
  dispatchRequest: (payload: any) => void
}

class ApiComponent<T extends ApiComponentProps, S> extends React.Component<T, S> {

  componentWillMount() {
    this.fetchIfNeeded(this.props);
  }

  componentWillReceiveProps(newProps: T) {
    this.fetchIfNeeded(newProps);
  }

  fetchIfNeeded(props: T) {
    if (!props.loading && !props.error) {
      props.dispatchRequest(this.props.apiParamsFn(props));
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
    return this.props.draw(this.props);
  }

}

function mapStateToProps(apiParamsFn: ApiParamsFn, renderFn: RenderFn, state: any, ownProps: any) {
  const url = apiParamsFn(ownProps).url;
  const data = state.fetch && state.fetch[url];
  return {
    ...data, ...ownProps, apiParamsFn, draw: renderFn
  };
}

export default (apiParamsFn: ApiParamsFn, renderFn: RenderFn) =>
  connect(mapStateToProps.bind(null, apiParamsFn, renderFn), {
    dispatchRequest: (payload) => ({ type: Actions.fetchRequest, payload })
  })(ApiComponent);