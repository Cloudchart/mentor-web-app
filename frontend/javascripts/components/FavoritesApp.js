import React from 'react'
import Relay from 'react-relay'
import moment from 'moment'

import UpdateUserThemeInsightMutation from '../mutations/UpdateUserThemeInsightMutation'


const Increment = 10


let isElementInViewport = (element) => {
  let rect = element.getBoundingClientRect()

  return (
    rect.top      >= 0 &&
    rect.right    <= window.innerWidth &&
    rect.bottom   <= window.innerHeight &&
    rect.left     >= 0
  )
}


let dislikeInsight = (insight, options = {}) => {
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


  state = {
    isLoadingMore: false
  }


  componentDidMount() {
    this._addScrollListener()
  }


  componentWillUnmount() {
    this._removeScrollListener()
  }


  _addScrollListener() {
    window.addEventListener('scroll', this.handleScroll)
  }

  _removeScrollListener() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  _loadMore = () => {
    if (this.state.isLoadingMore) return

    this.setState({ isLoadingMore: true })

    this.props.relay.setVariables({
      count: this.props.relay.variables.count + Increment
    }, (state) => state.done ? this.setState({ isLoadingMore: false }) : null)
  }


  handleDislike = (insight) =>
    (event) => {
      event.preventDefault()
      if (this.state.isInSync) return
      this.setState({ isInSync: insight.id })
      dislikeInsight(insight, { onSuccess: () => this.setState({ isInSync: false }) })
    }


  handleScroll = () => {
    if (!this.refs.loader) return
    if (!isElementInViewport(this.refs.loader)) return
    this._loadMore()
  }


  render() {
    return (
      <article id="favorites-app" className="app">
        <header>
          Favorites
        </header>
        <ul className="insight-list">
          {
            this.props.viewer.insights.edges
              .filter(insightEdge => insightEdge.node.rate > 0)
              .map(this.renderInsight)
          }
        </ul>
        { this.renderLoader() }
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
    let isInSync  = this.state.isInSync === insight.id
    let className = isInSync ? 'fa fa-spin fa-spinner' : 'fa fa-thumbs-o-down'
    return (
      <div className="controls">
        <i className={ className } onClick={ isInSync ? false : this.handleDislike(insight) } />
      </div>
    )
  }

  renderLoader() {
    if (!this.props.viewer.insights.pageInfo.hasNextPage) return
    return <div ref="loader" />
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
              rate
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
