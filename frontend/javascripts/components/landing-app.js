import React from 'react'
import Relay from 'react-relay'


let themeSorter = (a, b) => {
  a = a.node.name
  b = b.node.name
  return a < b ? -1 : a > b ? 1 : 0
}


class LandingApp extends React.Component {


  render() {
    return (
      <div>
        <ul>
          <li>
            <a href="/favorites">
              Your favourites
            </a>
          </li>
          <li>
            <a href="/today">
              Today for you:
            </a>
            { this.renderThemes() }
          </li>
          <li>
            <a href="/explore">
              Explore topics
            </a>
          </li>
          <li>
            <a href="/history">
              History
            </a>
          </li>
        </ul>
      </div>
    )
  }


  renderThemes = () =>
    <ul>
      {
        this.props.viewer.themes.edges
          .sort(themeSorter)
          .map(this.renderTheme)
      }
    </ul>


  renderTheme = (themeEdge) =>
    <li key={ themeEdge.node.id }>
      #{ themeEdge.node.name }
    </li>


}

export default Relay.createContainer(LandingApp, {

  fragments: {

    viewer: () => Relay.QL`
      fragment on User {
        id
        name
        themes(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `

  }

})
