import React from 'react'
import Relay from 'react-relay'

import AppBar from './components/shared/AppBar'
import Drawer from './components/shared/Drawer'
import Search from './components/shared/Search'

import Environment from 'admin/Environment'
import PathResolver from 'admin/PathResolver'


export default class RootComponent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showDrawer: false,
      query: '',
    }
  }

  toggleDrawer = () =>
    this.setState({ showDrawer: !this.state.showDrawer })

  hideDrawer = () =>
    this.setState({ showDrawer: false })


  handlePathChange = (path) => {
    PathResolver.replace(path)
    this.handleHistoryChange()
    // this.hideDrawer()
  }


  handleQueryChange = (query) =>
    this.setState({ query })

  handleHistoryChange = () =>
    this.setState({
      componentData: PathResolver.resolve(),
      query: ''
    })


  componentWillMount = () =>
    this.handleHistoryChange()


  componentDidMount = () =>
    PathResolver.onHistory(this.handleHistoryChangeWithTimeout)


  componentWillUnmount = () =>
    PathResolver.offHistory(this.handleHistoryChangeWithTimeout)


  handleHistoryChangeWithTimeout = () => {
    clearTimeout(this._handleHistoryChangeTimeout)
    this._handleHistoryChangeTimeout = setTimeout(this.handleHistoryChange)
  }


  render = () =>
    <div style={{ paddingTop: 84, paddingLeft: 270, paddingBottom: 20, paddingRight: 20 }}>
      { this.renderSelectedComponent() }

      <Drawer
        open      = { this.state.showDrawer }
        items     = { PathResolver.Data.map(({ title, path }) => ({ title, value: path }))}
        onChange  = { this.handlePathChange }
      />

      <AppBar
        query         = { this.state.query }
        title         = { this.state.componentData.title }
        onQueryChange = { this.handleQueryChange }
        onRequestMenu = { this.toggleDrawer }
      >
        <Search value={ this.state.query } onChange={ this.handleQueryChange } />
      </AppBar>
    </div>

  renderSelectedComponent = () => {
    let { Component, Route, props } = this.state.componentData
    props = { ...props, query: this.state.query }
    return Route
      ? <Relay.Renderer Container={ Component } environment={ Environment } queryConfig={ new Route(props) } />
      : <Component { ...props } />
  }

}
