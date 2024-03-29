import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin()

let forEach = Array.prototype.forEach

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin',
  })
)

forEach.call(document.querySelectorAll('[data-react-class]'), node => {
  let Component = require('components/' + node.dataset.reactClass)

  ReactDOM.render(<Component />, node)
})

forEach.call(document.querySelectorAll('[data-relay-class]'), node => {
  let Component = require('components/' + node.dataset.relayClass)
  let Router    = require('routes/' + node.dataset.relayRoute)

  let RouterProps = {}
  try { RouterProps = JSON.parse(node.dataset.routeProps) } catch(e) {}

  ReactDOM.render(<Relay.RootContainer Component={ Component } route={ new Router(RouterProps) } />, node)
})
