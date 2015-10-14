import React from 'react'
import Relay from 'react-relay'


import { VoteForInsightMutation } from '../mutations'


class FavoritesApp extends React.Component {

  state = {
    isInSync: false
  }

  _handleLikeClick = (insightEdge, event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: true })

    let mutation = new VoteForInsightMutation({
      mode:         'favorite',
      viewer:       this.props.viewer,
      theme:        insightEdge.theme,
      insight:      insightEdge.node,
      isPositive:   true
    })

    Relay.Store.update(mutation)
  }

  _handleDontLikeClick = (insightEdge, event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: true })

    let mutation = new VoteForInsightMutation({
      viewer:       this.props.viewer,
      theme:        insightEdge.theme,
      insight:      insightEdge.node,
      isPositive:   false
    })

    Relay.Store.update(mutation)
  }

  render() {
    return (
      <ul style={{ listStyle: 'none' }}>
        { this.renderInsights() }
      </ul>
    )
  }

  renderInsights() {
    return this.props.viewer.favoriteInsights.edges.map(this.renderInsight.bind(this))
  }

  renderInsight(edge) {
    let insight = edge.node
    return (
      <li key={ insight.id }>
        <p style={{ border: '1px solid #eee', padding: '20px', width: '25%'}}>
          { insight.content }
        </p>
        { this.renderControls(edge) }
      </li>
    )
  }

  renderControls(edge) {
    return (
      <div>
        <a href="#" style={{ color: 'green' }} onClick={ this._handleLikeClick.bind(this, edge) }>
          Like
        </a>
        &nbsp;
        <a href="#" style={{ color: 'red' }} onClick={ this._handleDontLikeClick.bind(this, edge) }>
          Don't like
        </a>
      </div>
    )
  }

}


export default Relay.createContainer(FavoritesApp, {

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${VoteForInsightMutation.getFragment('viewer')}
        favoriteInsights(first: 1000) {
          edges {
            theme {
              name
              ${VoteForInsightMutation.getFragment('theme')}
            }
            node {
              id
              content
            }
          }
        }
      }
    `
  }

})
