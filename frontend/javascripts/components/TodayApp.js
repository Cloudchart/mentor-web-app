import React from 'react'
import Relay from 'react-relay'
import Immutable from 'immutable'


class TodayApp extends React.Component {


  render() {
    return (
      <div>
        <a href="/">Back</a>
        <h2>Today for you</h2>
        { this.renderThemes() }
      </div>
    )
  }


  renderThemes = () =>
    <ul>
      {
        Immutable.Seq(this.props.viewer.themes.edges)
          .sortBy(themeEdge => themeEdge.node.theme.name)
          .map(this.renderTheme)
          .toJS()
      }
    </ul>


  renderTheme = (themeEdge) =>
    <li key={ themeEdge.node.id }>
      <a href={ themeEdge.node.theme.url }>
        { themeEdge.node.theme.name }
      </a>
    </li>


}

export default Relay.createContainer(TodayApp, {

  fragments: {

    viewer: () => Relay.QL`
      fragment on User {
      __typename
        themes: subscribedThemes(first: 3) {
          edges {
            node {
              id
              theme {
                url
                name
              }
            }
          }
        }
      }
    `

  }

})
