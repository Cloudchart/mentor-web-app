import React from 'react'
import Relay from 'react-relay'

import UpdateUserThemeInsightMutation from '../mutations/UpdateUserThemeInsightMutation'

class ThemeApp extends React.Component {


  state = {
  }


  handleInsightAction = (insight, action) =>
    (event) => {
      event.preventDefault()

      let mutation = new UpdateUserThemeInsightMutation({
        action:   action,
        user:     null,
        theme:    this.props.viewer.theme,
        insight:  insight
      })

      Relay.Store.update(mutation)
    }


  render() {
    return (
      <section id="theme-app" className="app">
        <header>
          { this.props.viewer.theme.name }
        </header>
        { this.renderInsight() }
        { this.renderInsightControls() }
      </section>
    )
  }

  renderInsight() {
    let insightEdge = this.props.viewer.theme.insights.edges[0]
    if (!insightEdge) return
    return (
      <p className="insight">
        { insightEdge.node.content }
      </p>
    )
  }

  renderInsightControls() {
    let insightEdge = this.props.viewer.theme.insights.edges[0]
    if (!insightEdge) return
    return (
      <div className="controls">
        <span className="dislike" onClick={ this.handleInsightAction(insightEdge.node, 'dislike') }>
          <i className="fa fa-times-circle" />
        </span>
        <span className="like" onClick={ this.handleInsightAction(insightEdge.node, 'like') }>
          <i className="fa fa-plus-circle" />
        </span>
      </div>
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
