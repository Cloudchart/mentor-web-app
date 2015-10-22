import React from 'react'
import Relay from 'react-relay'

import {
  RejectThemeMutation,
  SubscriptionThemeMutation
} from '../mutations'


class ThemesExplorer extends React.Component {


  _rejectTheme(theme) {
    let mutation = new RejectThemeMutation({
      viewer: this.props.viewer,
      theme:  theme
    })

    Relay.Store.update(mutation)
  }

  _subscribeOnTheme(theme) {
    let mutation = new SubscriptionThemeMutation({
      status: theme.isSubscribed ? 'visible' : 'subscribed',
      viewer: this.props.viewer,
      theme:  theme
    })

    Relay.Store.update(mutation)
  }


  handleRejectClick(theme, event) {
    event.preventDefault()
    if (!confirm(`Reject theme "${theme.name}"?`)) return

    this._rejectTheme(theme)
  }


  handleSubscribeClick(theme, event) {
    event.preventDefault()

    this._subscribeOnTheme(theme)
  }


  render() {
    return (
      <div>
        Themes Explorer
        { this.renderThemes() }
      </div>
    )
  }

  renderThemes() {
    return (
      <ul>
        { this.props.viewer.themes.edges.map(this.renderTheme.bind(this)) }
      </ul>
    )
  }


  renderTheme(themeEdge) {
    return (
      <li key={ themeEdge.node.id }>
        { this.renderThemeControls(themeEdge.node) }
        <a href={ themeEdge.node.url }>
          { themeEdge.node.name }
        </a>
      </li>
    )
  }


  renderThemeControls(theme) {
    return (
      <span>
        { this.renderRejectionControl(theme) }
        { this.renderSubscriptionControl(theme) }
      </span>
    )
  }

  renderSubscriptionControl(theme) {
    let icon = theme.isSubscribed ? '-' : '+'
    return (
      <a href="#" style={{ color: 'green', marginRight: '1ex' }} onClick={ this.handleSubscribeClick.bind(this, theme) }>
        [{icon}]
      </a>
    )
  }

  renderRejectionControl(theme) {
    return (
      <a href="#" style={{ color: 'red', marginRight: '1ex' }} onClick={ this.handleRejectClick.bind(this, theme) }>
        [x]
      </a>
    )
  }



}


export default Relay.createContainer(ThemesExplorer, {

  initialVariables: {
    size: 10
  },

  fragments: {
    viewer: () => {
      return Relay.QL`
        fragment on User {
          themes(first: $size) {
            edges {
              node {
                id, name, url, isSubscribed
                ${SubscriptionThemeMutation.getFragment('theme')}
              }
            }
          }
          ${RejectThemeMutation.getFragment('viewer')}
        }
      `
    }
  }

})
