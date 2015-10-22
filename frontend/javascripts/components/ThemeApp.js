import React from 'react'
import Relay from 'react-relay'
import Immutable from 'immutable'

import LikeUserThemeInsightMutation from '../mutations/LikeInsightMutation'

class ThemeApp extends React.Component {


  state = {
    isInSync:   false,
    error:      null
  }


  componentWillMount() {
    this._getUnratedInsight(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this._getUnratedInsight(nextProps)
  }


  _getUnratedInsight(props) {
    let unratedInsight = Immutable.Seq(props.viewer.theme.insights.edges)
      .filter(insight => !insight.node.rate)
      .first()

    let hasNextPage = this.props.viewer.theme.insights.pageInfo.hasNextPage

    this.setState({
      unratedInsight: unratedInsight ? unratedInsight.node : null,
      hasNextPage:    hasNextPage
    })

    if (!unratedInsight && hasNextPage)
      this.props.relay.setVariables({
        insightsCount: this.props.relay.variables.insightsCount + 10
      })
  }


  _handleLikeClick = (rate, event) => {
    event.preventDefault()

    if (this.state.isInSync) return

    this.setState({ isInSync: true, error: null })

    let mutation = new LikeUserThemeInsightMutation({ userThemeInsight: this.state.unratedInsight, rate: rate })

    Relay.Store.update(mutation, {
      onSuccess: this._handleLikeSuccess,
      onFailure: this._handleLikeFailure
    })
  }


  _handleLikeSuccess = (response) => {
    this.setState({ isInSync: false })
  }

  _handleLikeFailure = (transaction) => {
    let error = transaction.getError().source.errors[0].message
    this.setState({ isInSync: false, error: error })
  }


  render() {
    return (
      <div>
        <h2>#{ this.props.viewer.theme.theme.name }</h2>
        { this.renderError() }
        { this.renderInsight() }
        { this.renderInsightControls() }
        { this.renderPendingStatus() }
        { this.renderPlaceholder() }
      </div>
    )
  }

  renderError() {
    if (!this.state.error) return
    return (
      <p style={{ color: 'red' }}>
        { this.state.error }
      </p>
    )
  }

  renderInsight() {
    if (!this.state.unratedInsight) return
    return (
      <p style={{ width: 400 }}>
        { this.state.unratedInsight.insight.content }
      </p>
    )
  }


  renderInsightControls() {
    if (this.state.isInSync) return
    if (!this.state.unratedInsight) return
    return [
      <a href="#" key='like' onClick={ this._handleLikeClick.bind(this, 1) }>Like</a>
      ,
      <span key="spacer"> | </span>
      ,
      <a href="#" key='skip' onClick={ this._handleLikeClick.bind(this, -1) } style={{ color: 'red' }}>Skip</a>
    ]
  }

  renderPendingStatus() {
    if (!this.state.isInSync) return
    return (
      <span style={{ color: 'grey' }}>Pending...</span>
    )
  }

  renderPlaceholder() {
    if (this.state.unratedInsight || this.state.hasNextPage) return
    return (
      <p style={{ color: 'blue' }}>
        No more insights for you.
        <br />
        Check back later.
      </p>
    )
  }

}

export default Relay.createContainer(ThemeApp, {

  initialVariables: {
    themeID:        null,
    insightsCount:  10
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
      __typename
        theme(themeID: $themeID) {
          theme {
            name
          }
          insights(first: $insightsCount) {
            edges {
              node {
                id
                rate
                insight {
                  content
                }
                ${LikeUserThemeInsightMutation.getFragment('userThemeInsight')}
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      }
    `
  }

})
