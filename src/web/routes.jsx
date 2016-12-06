import * as React from 'react'

import { Route, IndexRoute } from 'react-router'

import { Root } from './containers/root'

import { Landing } from './containers/landing'

import { Explorer } from './containers/explorer'

import { Onboarding } from './porfolio/onboarding'
import { Portfolio } from './portfolio/main'
import { Overview } from './portfolio/overview'
import { NewWork } from './portfolio/newWork'

export function routes() {
  return <Route path='/' component={Root}>
    <IndexRoute component={Landing} />

    <Route path="/explorer" component={Explorer} />

    <Route path="/onboarding" component={Onboarding} />

    <Route path="/portfolio" component={Portfolio}>
      <IndexRoute component={Overview} />
      <Route path="/new" component={NewWork} />
    </Route>
  </Route>
}