import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './extensions/Window';
import createPoetStore from './store';
import { Router, browserHistory, IndexRoute } from "react-router";

const { store, pages } = createPoetStore();

class H extends React.Component<undefined, undefined> {
  render() {
    return <div>asddf</div>
  }
}

const routes = pages.map((page, index) => page.routeHook('' + index)).reduce((a, b) => a.concat(b), []);

ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        { routes }
      </Router>
    </Provider>
  ),
  document.getElementById("app")
);

