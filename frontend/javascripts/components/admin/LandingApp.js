import React from 'react'
import Relay, {
  RootContainer
} from 'react-relay'

import Navigator from '../Navigator'
import AdminRoute from '../../routes/admin/AdminRoute'
import TopicsApp from './TopicsApp'

import {
  AppBar,
  LeftNav,
  List,
  ListItem,
  Paper
} from 'material-ui'


// const RootRoutes = {
//   'topics': {
//     title: 'Topics',
//     Component:  TopicsApp,
//     Route:      AdminRoute,
//   }
// }

const RootRoutes = [
  {
    title:      'Topics',
    Component:  TopicsApp,
    Route:      AdminRoute,
  }
]


const InitialRoute = {
  Component:  Paper,
  title:      'Admin',
}

export default class extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      route: InitialRoute,
      isLeftNavOpen: false,
    }

    this.renderScene = this.renderScene.bind(this)
    this.handleNavigatorChange = this.handleNavigatorChange.bind(this)
    this.toggleLeftNav = this.toggleLeftNav.bind(this)
    this.handleRootRouteChange = this.handleRootRouteChange.bind(this)
  }

  render() {
    return (
      <div>
        <AppBar title={ this.state.route.title } onLeftIconButtonTouchTap={ this.toggleLeftNav } />
        <Navigator ref="navigator" initialRoute={ InitialRoute } renderScene={ this.renderScene } onChange={ this.handleNavigatorChange } />
        <LeftNav
          open            = { this.state.isLeftNavOpen }
          docked          = { false }
          onRequestChange = { isLeftNavOpen => this.setState({ isLeftNavOpen })}
        >
          <List>
            { RootRoutes.map((route, index) => this.renderRootRoute(route, index)) }
          </List>
        </LeftNav>
      </div>
    )
  }

  handleNavigatorChange(route) {
    this.setState({ route: route })
  }

  handleRootRouteChange(index) {
    this.refs.navigator._reset()
    this.refs.navigator._push(RootRoutes[index])
    this.setState({
      isLeftNavOpen: false
    })
  }

  renderScene(route, navigator) {
    let { Component, Route, props, title } = route
    return Route
      ? <RootContainer Component={ Component } route={ new Route({ ...props, navigator }) } />
      : <Component { ...props } navigator={ navigator } />
  }

  renderRootRoute = (route, index) =>
    <ListItem
      key         = { index }
      primaryText = { route.title }
      onTouchTap  = { event => this.handleRootRouteChange(index) }
    />

  toggleLeftNav() {
    this.setState({
      isLeftNavOpen: !this.state.isLeftNavOpen
    })
  }

}
