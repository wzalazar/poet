import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import './extensions/Window'
import { Hello } from './pages/HelloWorld/HelloWorld'
import createPoetStore from './store';

ReactDOM.render((
    <Provider store={ createPoetStore() }>
      <Hello />
    </Provider>
  ),
  document.getElementById("app")
);
