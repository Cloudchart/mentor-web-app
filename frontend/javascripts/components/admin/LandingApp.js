import React from 'react'
import Relay, {
  RootContainer
} from 'react-relay'

import Navigator from '../Navigator'
import AdminRoute from '../../routes/admin/AdminRoute'
import ChooserApp from './ChooserApp'

const InitialRoute = {
  Component:  ChooserApp,
  Route:      AdminRoute
}

export default class extends React.Component {

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return <Navigator initialRoute={ InitialRoute } renderScene={ this.renderScene } />
  }

  renderScene({ Component, Route, props }, navigator) {
    return Route
      ? <RootContainer Component={ Component } route={ new Route({ ...props, navigator }) } />
      : <Component { ...props } navigator={ navigator } />
  }

}
