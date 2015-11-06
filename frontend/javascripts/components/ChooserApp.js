import React from 'react'
import Relay from 'react-relay'

import ActivateUserMutation from '../mutations/ActivateUserMutation'
import UpdateUserThemeMutation from '../mutations/UpdateUserThemeMutation'

import { pluralize } from '../utils'

const MaxSubscriptionsCount = 3

const backgroundColorStart = [137, 59, 43]
const backgroundColorShift = [  0, -2,  3]


let backgroundColorPart = (index) =>
  (part, partIndex) =>
    part + backgroundColorShift[partIndex] * index + (partIndex == 0 ? '' : '%')


let backgroundColor = (index) =>
  `hsl(${backgroundColorStart.map(backgroundColorPart(index))})`


class ChooserApp extends React.Component {

  state = {
    subscriptionsIndices: []
  }

  componentWillMount() {
    this._updateSubscriptionsIndices(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this._updateSubscriptionsIndices(nextProps)
  }

  handleSubscribe(theme, event) {
    event.preventDefault()
    if (!this._canSubscribe()) return

    let mutation = new UpdateUserThemeMutation({ theme: theme, user: this.props.viewer, action: 'subscribe' })
    Relay.Store.update(mutation)
  }

  handleUnsubscribe(theme, event) {
    event.preventDefault()

    let mutation = new UpdateUserThemeMutation({ theme: theme, user: this.props.viewer, action: 'unsubscribe' })
    Relay.Store.update(mutation)
  }

  handleContinue = (event) => {
    event.preventDefault()

    let mutation = new ActivateUserMutation({ user: this.props.viewer })
    Relay.Store.update(mutation, {
      onSuccess: () => location.reload()
    })
  }


  _updateSubscriptionsIndices(props) {
    let indices = props.viewer.themes.edges
      .filter(themeEdge => themeEdge.node.isSubscribed)
      .map(themeEdge => themeEdge.node)
      .sort((a, b) => a.subscribedAt < b.subscribedAt ? -1 : a.subscribedAt > b.subscribedAt ? 1 : 0)
      .map(node => node.id)

    this.setState({
      subscriptionsIndices:   indices
    })
  }

  _subscriptionIndexOf = (id) =>
    this.state.subscriptionsIndices.indexOf(id) + 1

  _canSubscribe = () =>
    this.state.subscriptionsIndices.length < MaxSubscriptionsCount

  _canContinue = () =>
    this.state.subscriptionsIndices.length >= MaxSubscriptionsCount


  render() {
    return (
      <section id="chooser-app" className="app">
        <header>
          Select first three topics you're interested in
        </header>
        <ul className="themes">
          { this.props.viewer.themes.edges.map(this.renderTheme) }
        </ul>
        { this.renderContinueControl() }
      </section>
    )
  }

  renderTheme = (themeEdge, themeIndex) => {
    let theme = themeEdge.node
    return (
      <li
        key       = { theme.id }
        className = "theme"
        style     = {{ backgroundColor: backgroundColor(themeIndex) }}
        onClick   = { theme.isSubscribed ? this.handleUnsubscribe.bind(this, theme) : this.handleSubscribe.bind(this, theme) }
      >
        { theme.name }
        { this.renderThemeSubscriptionIndex(theme.id) }
      </li>
    )
  }

  renderThemeSubscriptionIndex = (id) => {
    let index = this._subscriptionIndexOf(id)
    return index > 0 ? <i>{ index }</i> : null
  }

  renderContinueControl = () =>
    this._canContinue() ? <button onClick={ this.handleContinue }>Continue</button> : null

}


export default Relay.createContainer(ChooserApp, {

  initialVariables: {
    count:  50,
    filter: 'DEFAULT'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        themes(first: $count, filter: $filter) {
          subscribedCount
          edges {
            node {
              id
              name
              isSubscribed
              subscribedAt
              ${UpdateUserThemeMutation.getFragment('theme')}
            }
          }
        }
        ${UpdateUserThemeMutation.getFragment('user')}
        ${ActivateUserMutation.getFragment('user')}
      }
    `
  }

})
