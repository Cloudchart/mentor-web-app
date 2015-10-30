import React from 'react'
import Relay from 'react-relay'


class LandingApp extends React.Component {

  render() {
    return (
      <div>
        <h2>Mentor</h2>
        { this.renderFavorites() }
        { this.renderTodayForYou() }
        { this.renderExplore() }
      </div>
    )
  }

  renderFavorites() {
    return (
      <div style={{ margin: 20 }}>
        <h3 style={{ margin: 0 }}>
          <a href="/favorites">
            Favorites
          </a>
        </h3>
      </div>
    )
  }

  renderTodayForYou() {
    return (
      <div style={{ margin: 20 }}>
        <h3 style={{ margin: 0, marginBottom: 5 }}>
          Today for you
        </h3>
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
          { this.props.viewer.themes.edges.map(this.renderTheme) }
        </ul>
      </div>
    )
  }

  renderTheme = (themeEdge) => {
    let theme = themeEdge.node
    return (
      <li key={ theme.id } style={{ margin: '5px 0' }}>
        <a href={ theme.url }>
          #{ theme.name }
        </a>
      </li>
    )
  }

  renderExplore() {
    return (
      <div style={{ margin: 20 }}>
        <h3 style={{ margin: 0 }}>
          <a href="/themes/explore">
            Explore
          </a>
        </h3>
      </div>
    )
  }

}


export default Relay.createContainer(LandingApp, {

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        themes(first: 3, filter: SUBSCRIBED) {
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
