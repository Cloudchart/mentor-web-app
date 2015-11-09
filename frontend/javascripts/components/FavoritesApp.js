import React from 'react'
import Relay from 'react-relay'
import moment from 'moment'

import UpdateUserThemeInsightMutation from '../mutations/UpdateUserThemeInsightMutation'


const Increment = 10


let dislikeInsight = (insight, options) => {
  let mutation = new UpdateUserThemeInsightMutation({
    action:   'dislike',
    user:     options.user  || null,
    theme:    options.theme || null,
    insight:  insight
  })

  Relay.Store.update(mutation, {
    onSuccess: options.onSuccess,
    onFailure: options.onFailure
  })
}


class FavoritesApp extends React.Component {

  handleDislike = (insight) =>
    (event) => {
      event.preventDefault()
      dislikeInsight(insight, { user: this.props.viewer })
    }

  handleLoadMore = () => {
    this.props.relay.setVariables({
      count: this.props.relay.variables.count + Increment
    })
  }

  render() {
    return (
      <article className="app">
        <header>
          Rate starred advice
        </header>
        <ul className="insight-list">
          {
            this.props.viewer.insights.edges
              .map(this.renderInsight)
          }
        </ul>
      </article>
    )
  }

  renderInsight = (insightEdge) => {
    let insight = insightEdge.node
    return (
      <li key={ insight.id } className="insight-item">
        <em>{ moment(new Date(insight.ratedAt)).format('ddd MMM D') }, { insight.theme.name }</em>
        <p>
          { insight.content }
        </p>
        { this.renderInsightControls(insight) }
      </li>
    )
  }

  renderInsightControls(insight) {
    return (
      <div className="controls">
        <i className="fa fa-thumbs-o-down" onClick={ this.handleDislike(insight) } />
      </div>
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
              ratedAt
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
