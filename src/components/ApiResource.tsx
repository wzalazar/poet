import * as React from "react";

export interface ResourceProps<T> {
  error: any
  loading: any
  result: T
  fetch: (url: string) => void
}

export abstract class ApiResource<T, S> extends React.Component<ResourceProps<T>, S> {

  readonly abstract apiPath: string;

  componentWillMount() {
    this.fetchIfNeeded(this.props);
  }

  componentWillReceiveProps(newProps: ResourceProps<T>) {
    this.fetchIfNeeded(newProps);
  }

  fetchIfNeeded(props: ResourceProps<T>) {
    if (!props.loading && !props.result && !props.error) {
      props.fetch(this.apiPath);
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
    return this.draw();
  }

  abstract draw(): JSX.Element;
}

