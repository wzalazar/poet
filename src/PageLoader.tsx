import * as React from "react"

import { Reducer } from "redux"
import { Saga } from "redux-saga"
import { connect, StatelessComponent, ComponentClass } from "react-redux"

export interface ReducerDescription<T> {
  subState: string
  reducer: Reducer<T>
}

export abstract class PageLoader<State, Properties> {

  abstract readonly component: ComponentClass<Properties> | StatelessComponent<Properties>;

  abstract initialState(): any
  abstract routeHook(): JSX.Element[]
  abstract reducerHook<State>(): ReducerDescription<State>
  abstract sagaHook(): Saga
  abstract select(state: any, ownProps: any): Properties

  protected container() {
    return connect(this.select.bind(this))(this.component)
  }

}
