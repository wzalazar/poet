import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore, Action} from "redux";
import {Provider} from "react-redux";
import {Hello} from "./components/Hello";
import {State} from "./state";

const store = createStore((state: State, action: Action) => {
  if (!state) {
    return { count: 0 };
  }
  if (action.type == 'increase') {
    return { count: state.count + 1 }
  }
});

ReactDOM.render((
  <Provider store={ store }>
    <Hello />
  </Provider>
  ),
  document.getElementById("app")
);
