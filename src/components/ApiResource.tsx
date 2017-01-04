import * as React from "react";

export interface ResourceProps {
  error: any
  loading: any
  result: any
  fetch: (url: string) => void
}

export abstract class ApiResource<T extends ResourceProps, S> extends React.Component<T, S> {

  readonly abstract apiPath: string

  componentWillMount() {
    this.fetchIfNeeded(this.props)
  }

  componentWillReceiveProps(newProps: ResourceProps) {
    this.fetchIfNeeded(newProps)
  }

  fetchIfNeeded(props: ResourceProps) {
    if (!props.loading && !props.result && !props.error) {
      props.fetch(this.apiPath)
    }
  }

  renderLoading() {
    return <span>Loading...</span>
  }

  renderError() {
    return <span>{this.props.error}</span>
  }

  render() {
    if (this.props.loading) {
      return this.renderLoading()
    }
    if (this.props.error) {
      return this.renderError()
    }
    return this.draw()
  }

  abstract draw(): JSX.Element
}

