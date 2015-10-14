import React from 'react'
import Relay from 'react-relay'

import ActivateViewerMutation from '../mutations/activate_viewer_mutation'
import ThemeToViewerMutation from '../mutations/theme_to_viewer_mutation'


let Theme = ({ themes, theme, onClick }) => {

  let handleClick = (event) => {
    event.preventDefault()
    if (onClick) onClick(theme)
  }

  let check = theme.isSelectedByViewer ? <i>+</i> : null

  return (
    <a href="#" onClick={ handleClick }>
      { check }
      { theme.name }
    </a>
  )
}


let ContinueButton = ({ themes, isInSync, onClick }) => {
  if (themes.length < 3) { return <noscript /> }

  return (
    <button onClick={ onClick } disabled={ isInSync }>
      Continue
    </button>
  )
}



class ChooserApp extends React.Component {


  state = {
    isInSync:   false,
    error:      null
  }

  _enterSyncState = () => this.setState({ isInSync: true })
  _leaveSyncState = () => this.setState({ isInSync: false })
  _reloadPage = () => location.reload()

  _leaveSyncStateWithError = (transaction) => {
    this._leaveSyncState()
  }

  _themesSelectedByViewer = () => this.props.viewer.defaultThemes.filter(theme => theme.isSelectedByViewer)


  handleThemeClick = (theme) => {
    if (this.state.isInSync) { return }
    if (this._themesSelectedByViewer().length == 3 && !theme.isSelectedByViewer) { return }
    this._enterSyncState()
    Relay.Store.update(new ThemeToViewerMutation({ theme: theme }), {
      onSuccess:  this._leaveSyncState,
      onFailure:  this._leaveSyncStateWithError
    })
  }


  handleContinueClick = () => {
    if (this.state.isInSync) { return }
    this._enterSyncState()
    Relay.Store.update(new ActivateViewerMutation({ viewer: this.props.viewer }), {
      onSuccess: this._reloadPage,
      onFailure: this._leaveSyncStateWithError
    })
  }


  render = () =>
    <div>
      { this.renderThemes() }
      <ContinueButton themes={ this._themesSelectedByViewer() } isInSync={ this.state.isInSync } onClick={ this.handleContinueClick } />
    </div>


  renderThemes = () =>
    <ul>
      { this.props.viewer.defaultThemes.map(this.renderTheme) }
    </ul>


  renderTheme = (theme) =>
    <li key={ theme.id }>
      <Theme themes={ this._themesSelectedByViewer() } theme={ theme } onClick={ this.handleThemeClick } />
    </li>

}


export default Relay.createContainer(ChooserApp, {

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name
        defaultThemes {
          id
          name
          isSelectedByViewer
          ${ThemeToViewerMutation.getFragment('theme')}
        }
        ${ActivateViewerMutation.getFragment('viewer')}
      }
    `
  }

})
