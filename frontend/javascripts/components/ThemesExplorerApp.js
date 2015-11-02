import React from 'react'
import Relay from 'react-relay'


import UpdateUserThemeMutation from '../mutations/UpdateUserThemeMutation'


class ThemesExplorerApp extends React.Component {

  state = {
    themesFilter: 'RELATED'
  }


  handleThemesFilterChange = (event) => {
    this.setState({ themesFilter: event.target.value })
    this.props.relay.setVariables({ filter: event.target.value })
  }


  handleThemeControlClick = (themeEdge, status, event) => {
    event.preventDefault()

    let mutation = new UpdateUserThemeMutation({ userTheme: themeEdge.node, user: this.props.viewer, status })

    Relay.Store.update(mutation)
  }


  render() {
    return (
      <div>
        <h2>Explore</h2>
        { this.renderThemesFilterSwitch() }
        { this.renderThemes() }
      </div>
    )
  }

  renderThemesFilterSwitch() {
    return (
      <div>
        <label>
          <input
            type      = 'radio'
            name      = 'themes-filter'
            value     = 'RELATED'
            checked   = { this.state.themesFilter == 'RELATED' }
            onChange  = { this.handleThemesFilterChange }
          /> Related
        </label>
        &nbsp;
        <label>
          <input
            type      = 'radio'
            name      = 'themes-filter'
            value     = 'UNRELATED'
            checked   = { this.state.themesFilter == 'UNRELATED' }
            onChange  = { this.handleThemesFilterChange }
          /> Unrelated
        </label>
      </div>
    )
  }

  renderThemes() {
    return (
      <ul style={{ listStyle: 'none', margin: '20px 0', padding: '0' }}>
        {
          this.props.viewer.themes.edges
            .sort((a, b) => a.node.name < b.node.name ? -1 : a.node.name > b.node.name ? 1 : 0)
            .map(this.renderTheme)
        }
      </ul>
    )
  }

  renderTheme = (themeEdge) => {
    let theme = themeEdge.node
    return (
      <li key={ theme.id } style={{ margin: '10px 0' }}>
        <a href={ theme.url }>
          { '#' + theme.name }
        </a>
        <div style={{ marginTop: 2, fontSize: '.75em' }}>
          { this.renderThemeControls(themeEdge) }
        </div>
      </li>
    )
  }

  renderThemeControls(themeEdge) {
    switch(this.state.themesFilter) {
      case 'RELATED':
        // Subscribe, Unsubscribe, Reject
        return [
          this.renderSubscribeControl(themeEdge),
          this.renderUnsubscribeControl(themeEdge),
          this.renderRejectControl(themeEdge),
        ]
      case 'UNRELATED':
        // Subscribe, Follow
        return [
          this.renderSubscribeControl(themeEdge),
          this.renderFollowControl(themeEdge)
        ]
    }
  }

  renderSubscribeControl(themeEdge) {
    if (themeEdge.node.isSubscribed) return
    return (
      <a href="#" onClick={ this.handleThemeControlClick.bind(this, themeEdge, 'SUBSCRIBED') } key="subscribe" style={{ color: 'green' }}>Subscribe</a>
    )
  }

  renderFollowControl(themeEdge) {
    if (themeEdge.node.isSubscribed) return
    return (
      <a href="#" onClick={ this.handleThemeControlClick.bind(this, themeEdge, 'VISIBLE') } key="follow" style={{ marginLeft: '1ex' }}>Follow</a>
    )
  }

  renderUnsubscribeControl(themeEdge) {
    if (!themeEdge.node.isSubscribed) return
    return (
      <a href="#" onClick={ this.handleThemeControlClick.bind(this, themeEdge, 'VISIBLE') } key="unsubscribe" style={{ color: 'red' }}>Unsubscribe</a>
    )
  }

  renderRejectControl(themeEdge) {
    return (
      <a href="#" onClick={ this.handleThemeControlClick.bind(this, themeEdge, 'REJECTED') } key="reject" style={{ color: 'red', marginLeft: '1ex' }}>Reject</a>
    )
  }

}


export default Relay.createContainer(ThemesExplorerApp, {

  initialVariables: {
    count:    50,
    filter:   'RELATED'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        themes(first: $count, filter: $filter) {
          edges {
            node {
              id
              name
              url
              isSubscribed
              ${UpdateUserThemeMutation.getFragment('userTheme')}
            }
          }
        }
        ${UpdateUserThemeMutation.getFragment('user')}
      }
    `
  }

})
