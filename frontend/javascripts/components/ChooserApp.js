import React from 'react'
import Relay from 'react-relay'

import ActivateUserMutation from '../mutations/ActivateUserMutation'
import UpdateUserThemeMutation from '../mutations/UpdateUserThemeMutation'


const MaxSubscriptionsCount = 3

import { pluralize } from '../utils'


class ChooserApp extends React.Component {

  state = {
    subscriptionsCount: 0
  }

  componentWillMount() {
    this._updateSubscriptionsCount(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this._updateSubscriptionsCount(nextProps)
  }

  handleSubscribe(theme, event) {
    event.preventDefault()
    if (this.state.subscriptionsCount == 0) return alert('No more')

    let mutation = new UpdateUserThemeMutation({ userTheme: theme, user: this.props.viewer, status: 'SUBSCRIBED' })
    Relay.Store.update(mutation)
  }

  handleUnsubscribe(theme, event) {
    event.preventDefault()

    let mutation = new UpdateUserThemeMutation({ userTheme: theme, user: this.props.viewer, status: 'VISIBLE' })
    Relay.Store.update(mutation)
  }

  handleContinue = (event) => {
    event.preventDefault()

    let mutation = new ActivateUserMutation({ user: this.props.viewer })
    Relay.Store.update(mutation, {
      onSuccess: () => location.reload()
    })
  }


  _updateSubscriptionsCount(props) {
    this.setState({
      subscriptionsCount: MaxSubscriptionsCount - props.viewer.themes.subscribedCount
    })
  }

  render() {
    return (
      <div>
        <h2>Choose {pluralize(this.state.subscriptionsCount, 'more topic', 'more topics')} to continue</h2>
        <ul style={{ listStyle: 'none', margin: '30px 0', padding: '0' }}>
          { this.props.viewer.themes.edges.map(this.renderTheme) }
        </ul>
        { this.renderContinueControl() }
      </div>
    )
  }

  renderTheme = (themeEdge) => {
    let theme = themeEdge.node
    return (
      <li key={ theme.id } style={{ margin: '10px 0' }}>
        #{ theme.name }
        <div>
          { this.renderSubscribeOnThemeControl(theme) }
          { this.renderUnsubscribeFromThemeControl(theme) }
        </div>
      </li>
    )
  }

  renderSubscribeOnThemeControl(theme) {
    let color = this.state.subscriptionsCount == 0 ? 'grey' : 'blue'
    return theme.isSubscribed
      ? null
      : <a href="#" onClick={ this.handleSubscribe.bind(this, theme) } style={{ color: color }}>Subscribe</a>
  }

  renderUnsubscribeFromThemeControl(theme) {
    return theme.isSubscribed
      ? <a href="#" onClick={ this.handleUnsubscribe.bind(this, theme) } style={{ color: 'red' }}>Unsubscribe</a>
      : null
  }

  renderContinueControl() {
    return this.state.subscriptionsCount == 0
      ? (
          <button style={{ margin: 0, padding: 10 }} onClick={ this.handleContinue }>
            Continue
          </button>
        )
      : null
  }

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
              ${UpdateUserThemeMutation.getFragment('userTheme')}
            }
          }
        }
        ${UpdateUserThemeMutation.getFragment('user')}
        ${ActivateUserMutation.getFragment('user')}
      }
    `
  }

})
