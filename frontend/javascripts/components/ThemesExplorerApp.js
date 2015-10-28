import React from 'react'
import Relay from 'react-relay'
import Immutable from 'immutable'


const Increment = 5
const ThemesFilters         = ['RELATED', 'UNRELATED']

const InitialCount          = 10
const InitialThemesFilter   = ThemesFilters[0]


class ThemesExplorer extends React.Component {

  state = {
    isInSync: false
  }

  _handleThemeFilterSwitchClick = (event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: true })

    let current = ThemesFilters.indexOf(this.props.relay.variables.filter)
    let next    = current === 1 ? 0 : 1

    this.props.relay.setVariables({
      count:  InitialCount,
      filter: ThemesFilters[next]
    }, readyState => readyState.done ? this.setState({ isInSync: false }) : null)
  }

  _handleMoreThemesButtonClick = (event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: true })

    this.props.relay.setVariables({
      count: this.props.relay.variables.count + Increment
    }, readyState => readyState.done ? this.setState({ isInSync: false }) : null)
  }

  _handleRejectThemeControlClick = (theme, event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: theme.id })
  }

  render() {
    return (
      <div>
        <h2>Explore topics</h2>
        { this.renderThemesFilterSwitch() }
        { this.renderThemes() }
        { this.renderMoreThemesButton() }
      </div>
    )
  }

  renderThemesFilterSwitch() {
    return (
      <button onClick={ this._handleThemeFilterSwitchClick } style={{ margin: 0, marginBottom: 10, padding: 10 }}>
        { this.props.relay.variables.filter }
      </button>
    )
  }

  renderThemes() {
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        { this.props.viewer.themes.edges.map(this.renderTheme) }
      </ul>
    )
  }

  renderTheme = (themeEdge) => {
    let theme = themeEdge.node
    return (
      <li key={ theme.id } style={{ margin: '0 0 1em' }}>
        <a href={ theme.url }>
          { theme.name }
        </a>
        { this.renderRejectThemeControl(theme) }
      </li>
    )
  }

  renderRejectThemeControl = (theme) => {
    if (this.props.relay.variables.filter != 'RELATED') return
    if (this.state.isInSync === theme.id) return
    return (
      <a href="#" onClick={ this._handleRejectThemeControlClick.bind(this, theme) } style={{ color: 'red', marginLeft: '1ex', whiteSpace: 'nowrap' }}>
        Fuck it!
      </a>
    )
  }

  renderMoreThemesButton() {
    if (this.state.isInSync) return
    if (!this.props.viewer.themes.pageInfo.hasNextPage) return

    return (
      <button onClick={ this._handleMoreThemesButtonClick } style={{ margin: 0, padding: 10 }}>
        Load more...
      </button>
    )
  }
}


export default Relay.createContainer(ThemesExplorer, {

  initialVariables: {
    count:  InitialCount,
    filter: InitialThemesFilter
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
      __typename
        themes: nthemes(first: $count, filter: $filter) {
          pageInfo { hasNextPage }
          edges {
            node {
              id
              name
              url
            }
          }
        }
      }
    `
  }

})
