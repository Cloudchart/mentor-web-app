import Relay from 'react-relay'


export default class extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User { id }
    `
    ,
    theme: () => Relay.QL`
      fragment on UserTheme { id }
    `
    ,
    insight: () => Relay.QL`
      fragment on UserThemeInsight { id }
    `
  }

  getMutation = () => {
    switch(this.props.action) {
      case 'like':
        return Relay.QL`mutation { likeInsight }`
      case 'dislike':
        return Relay.QL`mutation { dislikeInsight }`
      case 'reset':
        return Relay.QL`mutation { resetInsight }`
    }
  }

  getFatQuery = () => {
    switch (this.props.action) {
      case 'like':
        return Relay.QL`
          fragment on LikeInsightPayload {
            insight
            theme
            user
          }
        `
      case 'dislike':
        return Relay.QL`
          fragment on DislikeInsightPayload {
            insight
            theme
            user
          }
        `
      case 'reset':
        return Relay.QL`
          fragment on ResetInsightPayload {
            insight
            theme
            user
          }
        `
    }
  }

  getVariables = () => ({
    id: this.props.insight.id
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: {
      user:     this.props.user ? this.props.user.id : null,
      theme:    this.props.theme ? this.props.theme.id : null,
      insight:  this.props.insight.id,
    }
  }]

}
