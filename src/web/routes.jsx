import * as React from 'react'

import { Route, IndexRoute } from 'react-router'

import { Root } from './containers/root'

import { Landing } from './containers/landing'

import { Explorer } from './search/main'
import { Search } from './search/result'
import { BlockDetail } from './search/block'
import { ClaimDetail } from './search/claim'
import { ProfileDetail } from './search/profile'

import { Portfolio } from './portfolio/main'
import { Overview } from './portfolio/overview'
import { Onboarding } from './portfolio/onboarding'
import { NewWork } from './portfolio/newWork'

import { Settings } from './containers/settings'

export function routes() {
  return <Route path='/' component={Root}>
    <IndexRoute component={Landing} />

    <Route path="/explorer" component={Explorer} />
    <Route path="/search/:id" component={Search} />
    <Route path="/block/:id" component={BlockDetail} />
    <Route path="/claim/:id" component={ClaimDetail} />
    <Route path="/profile/:id" component={ProfileDetail} />

    <Route path="/onboarding" component={Onboarding} />
    <Route path="/settings" component={Settings} />

    <Route path="/portfolio" component={Portfolio}>
      <IndexRoute component={Overview} />
      <Route path="/new" component={NewWork} />
    </Route>
  </Route>
}