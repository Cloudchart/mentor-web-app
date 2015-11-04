import React from 'react'
import Relay from 'react-relay'


class ThemeApp extends React.Component {


  handleLikeClick = (event) => {
    event.preventDefault()
    // Like Insight Mutation
  }


  handleDislikeClick = (event) => {
    event.preventDefault()
    // Dislike Insight Mutation
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
        { this.renderInsightControls() }
      </div>
    )
  }

  renderInsightControls() {
    return (
      <p>
        <a href="#" onClick={ this.handleLikeClick } style={{ color: 'green' }}>
          Like
        </a>
        <a href="#" onClick={ this.handleDislikeClick } style={{ color: 'red', marginLeft: '1ex' }}>
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
          id
          name
          insights(first: 5, filter: UNRATED) {
            edges {
              node {
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
