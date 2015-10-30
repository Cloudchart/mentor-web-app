import React from 'react'
import Relay from 'react-relay'

class ThemesExplorerApp extends React.Component {

  state = {
    themesFilter: 'RELATED'
  }


  handleThemesFilterChange = (event) => {
    this.setState({ themesFilter: event.target.value })
    this.props.relay.setVariables({ filter: event.target.value })
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
        { this.props.viewer.themes.edges.map(this.renderTheme) }
      </ul>
    )
  }

  renderTheme = (themeEdge) => {
    let theme = themeEdge.node
    return (
      <li key={ theme.id } style={{ margin: '10px 0' }}>
        <a href={ theme.url }>
          #{ theme.name }
        </a>
      </li>
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
            }
          }
        }
      }
    `
  }

})
