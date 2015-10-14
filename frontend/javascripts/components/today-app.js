import React from 'react'
import Relay from 'react-relay'


let themeSorter = (a, b) => {
  a = a.node.name
  b = b.node.name
  return a < b ? -1 : a > b ? 1 : 0
}


class TodayApp extends React.Component {


  render() {
    return (
      <div>
        <ul>
          { this.renderThemes() }
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
      <a href={ '/themes/' + themeEdge.node.id }>
        #{ themeEdge.node.name }
      </a>
    </li>


}

export default Relay.createContainer(TodayApp, {

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
