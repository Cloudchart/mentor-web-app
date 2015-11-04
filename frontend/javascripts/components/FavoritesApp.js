import React from 'react'
import Relay from 'react-relay'

import UpdateUserThemeInsightMutation from '../mutations/UpdateUserThemeInsightMutation'


const Increment = 10


class FavoritesApp extends React.Component {

  handleDislike = (insight, event) => {
    event.preventDefault()

    let mutation = new UpdateUserThemeInsightMutation({
      action:   'dislike',
      user:     this.props.viewer,
      theme:    null,
      insight:  insight
    })

    Relay.Store.update(mutation)
  }

  handleLoadMore = () => {
    this.props.relay.setVariables({
      count: this.props.relay.variables.count + Increment
    })
  }

  render() {
    return (
      <div>
        <h2>Favorites</h2>
        { this.renderInsights() }
        { this.renderLoadMoreControl() }
      </div>
    )
  }

  renderInsights() {
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        { this.props.viewer.insights.edges.map(this.renderInsight) }
      </ul>
    )
  }

  renderInsight = (insightEdge) => {
    let insight = insightEdge.node
    return (
      <li key={ insight.id } style={{ width: 400, margin: '20px 0' }}>
        { insight.content }
        <span style={{ color: 'grey', marginLeft: '1ex' }}>#{insight.theme.name}</span>
        { this.renderInsightControls(insight) }
      </li>
    )
  }

  renderInsightControls(insight) {
    return (
      <div style={{ margin: 0, marginTop: 5 }}>
        <a href="#" onClick={ this.handleDislike.bind(this, insight) } style={{ color: 'red' }}>
          Dislike
        </a>
      </div>
    )
  }

  renderLoadMoreControl() {
    if (!this.props.viewer.insights.pageInfo.hasNextPage) return
    return (
      <p>
        <button onClick={ this.handleLoadMore }>Load more...</button>
      </p>
    )
  }

}


export default Relay.createContainer(FavoritesApp, {


  initialVariables: {
    count: Increment
  },


  fragments: {

    viewer: () => Relay.QL`
      fragment on User {
        ${UpdateUserThemeInsightMutation.getFragment('user')}
        insights(first: $count, filter: POSITIVE) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              ${UpdateUserThemeInsightMutation.getFragment('insight')}
              id
              content
              theme {
                name
              }
            }
          }
        }
      }
    `

  }

})
