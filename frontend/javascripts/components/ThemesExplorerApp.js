import React from 'react'
import Relay from 'react-relay'
import Immutable from 'immutable'

import CreateThemeMutation from '../mutations/CreateThemeMutation'


const MaxSubscribedThemesCount = 3


class ThemesExplorer extends React.Component {


  state = {
    query:                  '',
    themes:                 Immutable.Seq(),
    isInSync:               false,
    subscribedThemesCount:  0
  }


  componentWillMount() {
    this._populateState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this._populateState(nextProps)
  }

  _populateState(props) {
    let themes = Immutable.Seq(props.viewer.themes.edges)
    this.setState({
      themes:                 themes,
      subscribedThemesCount:  themes.filter(theme => theme.node.status === 'subscribed').count()
    })
  }


  _handleQueryChange = (event) => {
    event.preventDefault()
    if (this.state.isInSync) return

    this.setState({ query: event.target.value })
  }

  _handleCreateThemeClick = (event) => {
    event.preventDefault()
    if (this.state.isInSync) return

    this.setState({ isInSync: true })

    let mutation = new CreateThemeMutation({ viewer: this.props.viewer, name: this.state.query })

    Relay.Store.update(mutation, {
      onSuccess:  this._handleCreateThemeSuccess,
      onFailure:  this._handleCreateThemeFailure
    })
  }

  _handleCreateThemeSuccess = () => {
    this.setState({
      query:    '',
      isInSync: false
    })
  }

  _handleCreateThemeFailure = () => {
    this.setState({
      isInSync: false
    })
  }


  render = () =>
    <div>
      <h2>Themes explorer</h2>
      { this.renderSearch() }
      { this.renderCreateThemeControl() }
      { this.renderThemes() }
    </div>


  renderSearch = () =>
    <div>
      <input type="search" autoFocus={ true } value={ this.state.query} onChange={ this._handleQueryChange } />
    </div>


  renderCreateThemeControl = () => {
    if (this.state.query.trim().length < 2) return
    return (
      <a href="#" onClick={ this._handleCreateThemeClick }>
        Create theme {this.state.query}
      </a>
    )
  }


  renderThemes = () =>
    <ul>
      {
        this.state.themes
          .filterNot(themeEdge => themeEdge.node.status === 'rejected')
          .filter(themeEdge => themeEdge.node.name.indexOf(this.state.query) !== -1)
          .sortBy(themeEdge => themeEdge.node.name)
          .map(this.renderTheme)
          .toArray()
      }
    </ul>


  renderTheme = (themeEdge) =>
    <li key={ themeEdge.node.id }>
      { themeEdge.node.name }
    </li>


}


export default Relay.createContainer(ThemesExplorer, {

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
      __typename
        ${CreateThemeMutation.getFragment('viewer')}
        themes(first: 1000) {
          edges {
            node {
              id
              name
              status
            }
          }
        }
      }
    `
  }

})
