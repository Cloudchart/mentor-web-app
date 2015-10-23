import React from 'react'
import Relay from 'react-relay'
import Immutable from 'immutable'


class LandingApp extends React.Component {


  render = () =>
    <div>
      <h2>Mentor</h2>
      <ul>
        <li>
          { this.renderFavorites() }
        </li>
        <li>
          { this.renderToday() }
        </li>
        <li>
          { this.renderExplore() }
        </li>
        <li>
          { this.renderHistory() }
        </li>
      </ul>
    </div>


  renderFavorites = () =>
    <a href="/favorites">
      Your favourites
    </a>

  renderToday = () =>
    <div>
      <a href="/today">
        Today for you:
      </a>
      <br />
      { this.renderThemes(3) }
    </div>

  renderThemes = (count) =>
    Immutable.Seq(this.props.viewer.themes.edges)
      .sortBy(themeEdge => themeEdge.node.name)
      .map(themeEdge => `#${themeEdge.node.name}`)
      .join(' ')

  renderExplore = () =>
    <a href="/explore">
      Explore topics
    </a>

  renderHistory = () =>
    <a href="/history">
      History
    </a>


}


export default Relay.createContainer(LandingApp, {

  fragments: {

    viewer: () => Relay.QL`
      fragment on User {
      __typename
        id
        name
        themes: subscribedThemes(first: 3) {
          edges {
            node {
              id
              status
              name
            }
          }
        }
      }
    `

  }

})
