import React from 'react'
import Relay from 'react-relay'

import UpdateUserThemeInsightMutation from '../mutations/UpdateUserThemeInsightMutation'

class ThemeApp extends React.Component {


  handleLikeClick = (insight, event) => {
    event.preventDefault()

    let mutation = new UpdateUserThemeInsightMutation({
      action:   'like',
      user:     null,
      theme:    this.props.viewer.theme,
      insight:  insight
    })
    Relay.Store.update(mutation)
  }


  handleDislikeClick = (insight, event) => {
    event.preventDefault()

    let mutation = new UpdateUserThemeInsightMutation({
      action:   'dislike',
      user:     null,
      theme:    this.props.viewer.theme,
      insight:  insight
    })
    Relay.Store.update(mutation)
  }


  render() {
    return (
      <div>
        <h2>
          { `#${this.props.viewer.theme.name}` }
        </h2>
        { this.renderInsight() }
      </div>
    )
  }

  renderInsight() {
    let insightEdge = this.props.viewer.theme.insights.edges[0]
    if (!insightEdge) return
    return (
      <div style={{ width: 400 }}>
        { insightEdge.node.content }
        { this.renderInsightControls(insightEdge.node) }
      </div>
    )
  }

  renderInsightControls(insight) {
    return (
      <p>
        <a href="#" onClick={ this.handleLikeClick.bind(this, insight) } style={{ color: 'green' }}>
          Like
        </a>
        <a href="#" onClick={ this.handleDislikeClick.bind(this, insight) } style={{ color: 'red', marginLeft: '1ex' }}>
          Dislike
        </a>
      </p>
    )
  }

}


export default Relay.createContainer(ThemeApp, {

  initialVariables: {
    themeID: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        theme(id: $themeID) {
          ${UpdateUserThemeInsightMutation.getFragment('theme')}
          id
          name
          insights(first: 5, filter: UNRATED) {
            edges {
              node {
                ${UpdateUserThemeInsightMutation.getFragment('insight')}
                id
                content
              }
            }
          }
        }
      }
    `
  }

})
