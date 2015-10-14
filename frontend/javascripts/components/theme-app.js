import React from 'react'
import Relay from 'react-relay'
import Immutable from 'immutable'


import VoteForInsightMutation from '../mutations/vote_for_insight_mutation'


let diffInsights = (themeInsights, userInsights) => {
  let ids = Immutable.Seq(userInsights.map(edge => edge.node.id))
  return Immutable.Seq(themeInsights).filterNot(edge => {
    return ids.contains(edge.node.id)
  }).toArray()
}


class ThemeApp extends React.Component {


  state = {
    isInSync: false
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      currentInsight: diffInsights(nextProps.theme.insights.edges, nextProps.theme.viewerInsights.edges)[0]
    })
  }


  componentWillMount() {
    this.setState({
      currentInsight: diffInsights(this.props.theme.insights.edges, this.props.theme.viewerInsights.edges)[0]
    })
  }


  _onSuccess = () => {
    this.setState({
      isInSync: false
    })
  }

  _onFailure = () => {
    this.setState({
      isInSync: false
    })
  }

  handleLikeClick = (event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: true })
    let mutation = new VoteForInsightMutation({
      mode:         'theme',
      theme:        this.props.theme,
      insight:      this.state.currentInsight.node,
      isPositive:   true
    })
    Relay.Store.update(mutation, {
      onSuccess: this._onSuccess,
      onFailure: this._onFailure
    })
  }


  handleDontLikeClick = (event) => {
    event.preventDefault()
    if (this.state.isInSync) return
    this.setState({ isInSync: true })
    let mutation = new VoteForInsightMutation({
      mode:         'theme',
      theme:        this.props.theme,
      insight:      this.state.currentInsight.node,
      isPositive:   false
    })
    Relay.Store.update(mutation, {
      onSuccess: this._onSuccess,
      onFailure: this._onFailure
    })
  }


  render() {
    return (
      <div>
        { this.renderComplete() }
        { this.renderInsight() }
        { this.renderControls() }
      </div>
    )
  }


  renderComplete() {
    if (this.state.currentInsight) return null
    return (
      <p>
        No more insights to vote!
      </p>
    )
  }


  renderInsight() {
    if (!this.state.currentInsight) return null
    return (
      <p style={{ border: '1px solid #eee', padding: '20px', width: '25%' }}>
        { this.state.currentInsight.node.content }
      </p>
    )
  }


  renderControls() {
    if (!this.state.currentInsight) return null
    return (
      <div>
        <a href="#" style={{ color: 'green' }} onClick={ this.handleLikeClick }>
          Like
        </a>
        &nbsp;
        <a href="#" style={{ color: 'red' }} onClick={ this.handleDontLikeClick }>
          Don't like
        </a>
      </div>
    )
  }

}


export default Relay.createContainer(ThemeApp, {

  fragments: {
    theme: () => Relay.QL`
      fragment on Theme {
        id
        name
        ${VoteForInsightMutation.getFragment('theme')}
        insights(first: 1000) {
          edges {
            node {
              id
              content
            }
          }
        }
        viewerInsights(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    `
  }

})
