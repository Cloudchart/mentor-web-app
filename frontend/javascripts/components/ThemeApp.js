import React from 'react'
import Relay from 'react-relay'

import UpdateUserThemeInsightMutation from '../mutations/UpdateUserThemeInsightMutation'

class ThemeApp extends React.Component {


  state = {
    lastUpdatedInsight: null
  }

  handleInsightAction = (insight, action, event) => {
    event.preventDefault()

    let mutation = new UpdateUserThemeInsightMutation({
      action:   action,
      user:     null,
      theme:    this.props.viewer.theme,
      insight:  insight
    })

    Relay.Store.update(mutation)

    this.setState({ lastUpdatedInsight: action === 'reset' ? null : insight })
  }


  render() {
    return (
      <div>
        <h2>
          { `#${this.props.viewer.theme.name}` }
        </h2>
        { this.renderUndoControl() }
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
        <a href="#" onClick={ this.handleInsightAction.bind(this, insight, 'like') } style={{ color: 'green' }}>
          Like
        </a>
        <a href="#" onClick={ this.handleInsightAction.bind(this, insight, 'dislike') } style={{ color: 'red', marginLeft: '1ex' }}>
          Dislike
        </a>
      </p>
    )
  }

  renderUndoControl() {
    if (!this.state.lastUpdatedInsight) return
    return (
      <p>
        <a href="#" onClick={ this.handleInsightAction.bind(this, this.state.lastUpdatedInsight, 'reset') }>
          Undo
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
