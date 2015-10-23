import React from 'react'
import Relay from 'react-relay'

import UpdateUserThemeStatus from '../mutations/UpdateUserThemeStatusMutation'
import ActivateViewer from '../mutations/ActivateViewerMutation'

const RequiredThemesCount = 3

class ChooserApp extends React.Component {

  state = {
    isInSync:               false,
    subscribedThemesCount:  0,
    error:                  null
  }

  _updateSubscribedThemesCount = (props) => {
    this.setState({
      subscribedThemesCount: props.viewer.themes.edges.filter(edge => edge.node.status == 'subscribed').length
    })
  }


  _handleSyncComplete = () =>
    this.setState({ isInSync: false })


  _handleThemeEdgeControlClick(userTheme, event) {
    event.preventDefault()

    if (this.state.isInSync === true) return
    if (this.state.subscribedThemesCount >= RequiredThemesCount && userTheme.node.status !== 'subscribed') return

    this.setState({ isInSync: true, error: null })

    let mutation = new UpdateUserThemeStatus({
      userTheme:  userTheme.node,
      status:     userTheme.node.status === 'subscribed' ? 'visible' : 'subscribed'
    })

    Relay.Store.update(mutation, {
      onSuccess: this._handleSyncComplete,
      onFailure: this._handleSyncComplete
    })
  }

  _handleContinueButtonClick = (event) => {
    event.preventDefault()

    if (this.state.isInSync === true) return
    if (this.state.subscribedThemesCount < RequiredThemesCount) return

    this.setState({ isInSync: true, error: null })

    let mutation = new ActivateViewer({ viewer: this.props.viewer })

    Relay.Store.update(mutation, {
      onSuccess: this._handleActivationSuccess,
      onFailure: this._handleActivationFailure
    })
  }

  _handleActivationSuccess = (response) => {
    location.reload()
  }


  _handleActivationFailure = (transaction) => {
    this.setState({
      isInSync: false,
      error:    transaction.getError().source.errors[0].message
    })
  }


  componentWillMount() {
    this._updateSubscribedThemesCount(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this._updateSubscribedThemesCount(nextProps)
  }


  render() {
    return (
      <div>
        <h2>Chooser</h2>
        <h3>Choose {RequiredThemesCount} themes</h3>
        { this.renderError() }
        { this.renderThemes() }
        { this.renderContinueButton() }
        { this.renderPendingStatus() }
      </div>
    )
  }


  renderError() {
    if (this.state.error === null) return
    return (
      <p style={ Styles.error }>
        { this.state.error }
      </p>
    )
  }


  renderThemes() {
    return (
      <ul>
        { this.props.viewer.themes.edges.map(this.renderTheme) }
      </ul>
    )
  }


  renderTheme = (userTheme) =>
    <li key={ userTheme.node.id } style={ Styles.theme }>
      { this.renderThemeControls(userTheme) }
      { userTheme.node.name }
    </li>


  renderThemeControls = (userTheme) => {
    let action = userTheme.node.status == 'subscribed' ? '-' : '+'
    return (
      <a href="#" style={ Styles.themeControl } onClick={ this._handleThemeEdgeControlClick.bind(this, userTheme) }>[{action}]</a>
    )
  }

  renderContinueButton() {
    if (this.state.isInSync === true) return
    if (this.state.subscribedThemesCount < RequiredThemesCount) return

    return (
      <button onClick={ this._handleContinueButtonClick }>
        Continue
      </button>
    )
  }

  renderPendingStatus() {
    if (this.state.isInSync !== true) return

    return (
      <p style={ Styles.pendingStatus }>Pending...</p>
    )
  }

}

const Styles = {
  error: {
    color: 'red'
  },
  theme: {
    textTransform: 'capitalize'
  },
  themeControl: {
    marginRight: '1ex'
  },
  pendingStatus: {
    color: 'grey'
  }
}

export default Relay.createContainer(ChooserApp, {

  fragments: {

    viewer: () => Relay.QL`
      fragment on User {
      __typename
        ${ActivateViewer.getFragment('viewer')}
        isActive
        themes(first: 100, onlyDefault: true) {
          edges {
            node {
              ${UpdateUserThemeStatus.getFragment('userTheme')}
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
