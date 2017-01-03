import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './extensions/Window'
import { HelloWorld } from './pages/HelloWorld/HelloWorldComponent'
import createPoetStore from './store';

ReactDOM.render((
    <Provider store={ createPoetStore() }>
      <HelloWorld />
    </Provider>
  ),
  document.getElementById("app")
);

