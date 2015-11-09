import React from 'react'
import Relay from 'react-relay'


class LandingApp extends React.Component {

  render() {
    return (
      <section id="landing-app" className="app">
        <header>
          Mentor
        </header>
        <ul className="gradient-list">
          <li className="gradient-item">
            <a href="/favorites">Favorites</a>
          </li>
          <li className="gradient-item today">
            <a href="/themes/today">
              Today for you
              { this.renderThemes() }
            </a>
          </li>
          <li className="gradient-item">
            <a href="/themes/explore">Explore</a>
          </li>
        </ul>
      </section>
    )
  }

  renderThemes() {
    return (
      <ul>
        { this.props.viewer.themes.edges.map(this.renderTheme) }
      </ul>
    )
  }

  renderTheme = (themeEdge) => {
    let theme = themeEdge.node
    return (
      <li key={ theme.id }>
        #{ theme.name.toLowerCase() }
      </li>
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
