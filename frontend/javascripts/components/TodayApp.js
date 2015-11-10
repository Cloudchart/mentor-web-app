import React from 'react'
import Relay from 'react-relay'


class TodayApp extends React.Component {

  render = () =>
    <section id="today-app" className="app">
      <header>
        Today for you
      </header>
      <ul className="gradient-list">
        {
          this.props.viewer.themes.edges.map(this.renderTheme)
        }
      </ul>
    </section>


  renderTheme = (themeEdge) => {
    let theme = themeEdge.node
    let left  = Math.min(100, Math.round(theme.insights.ratedCount / theme.insights.totalCount * 100))
    return (
      <li key={ theme.id } className="gradient-item">
        <div className="progress" style={{ left: left + '%' }}/>
        <a href={ theme.url }>
          { theme.name }
        </a>
      </li>
    )
  }

}


export default Relay.createContainer(TodayApp, {


  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name
        themes(first: 3, filter: SUBSCRIBED) {
          edges {
            node {
              id
              name
              url
              insights {
                totalCount
                ratedCount
              }
            }
          }
        }
      }
    `
  }


})
