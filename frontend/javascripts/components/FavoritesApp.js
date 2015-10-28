import React from 'react'
import Relay from 'react-relay'


import UpdateInsightMutation from '../mutations/UpdateInsightMutation'


class FavoritesApp extends React.Component {

  state = {
    isInSync: false
  }

  _handleMoreInsightsButtonClick = (event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: true })

    this.props.relay.setVariables({
      count: this.props.relay.variables.count + 5
    }, readyState => readyState.done ? this.setState({ isInSync: false }) : null)
  }

  _handleUnlikeInsightControlClick = (insight, event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: true })

    let mutation = new UpdateInsightMutation({
      viewer:   this.props.viewer,
      insight:  insight,
      rate:     -1
    })

    Relay.Store.update(mutation, {
      onSuccess: this._handleUnlikeInsightSuccess,
      onFailure: this._handleUnlikeInsightFailure
    })
  }

  _handleUnlikeInsightSuccess = () => {
    this.setState({ isInSync: false })
  }

  _handleUnlikeInsightFailure = () => {
    this.setState({ isInSync: false })
  }

  render() {
    return (
      <div>
        <h2>Favorites</h2>
        { this.renderInsights() }
        { this.renderMoreInsightsButton() }
      </div>
    )
  }

  renderInsights() {
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        { this.props.viewer.insights.edges.map(this.renderInsight) }
      </ul>
    )
  }

  renderInsight = (insightEdge) => {
    let insight = insightEdge.node
    return (
      <li key={ insight.id } style={{ width: 400, margin: '0 0 1em' }}>
        { insight.content }
        { this.renderInsightUnlikeControl(insight) }
        <div style={{ color: 'grey', marginTop: '.25em' }}>
          <em>at #{ insight.theme.name }</em>
        </div>
      </li>
    )
  }

  renderInsightUnlikeControl(insight) {
    return (
      <a href="#" onClick={ this._handleUnlikeInsightControlClick.bind(this, insight) } style={{ color: 'red', marginLeft: '1ex', whiteSpace: 'nowrap' }}>
        Fuck it!
      </a>
    )
  }

  renderMoreInsightsButton() {
    if (this.state.isInSync) return
    if (!this.props.viewer.insights.pageInfo.hasNextPage) return

    return (
      <button onClick={ this._handleMoreInsightsButtonClick } style={{ margin: 0, padding: 10 }}>
        Load more...
      </button>
    )
  }

}


export default Relay.createContainer(FavoritesApp, {


  initialVariables: {
    cursor: null,
    count:  5
  },


  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
      __typename
        insights(first: $count, after: $cursor) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              ${UpdateInsightMutation.getFragment('insight')}
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
