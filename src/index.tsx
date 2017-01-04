import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from "react-router";

import './extensions/Window';
import createPoetStore from './store';

const { store, pages } = createPoetStore();

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

