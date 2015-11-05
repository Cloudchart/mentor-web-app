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
  }

  getMutation = () => {
    switch(this.props.action) {
      case 'subscribe':
        return Relay.QL`
          mutation { subscribeOnTheme }
        `
      case 'unsubscribe':
        return Relay.QL`
          mutation { unsubscribeFromTheme }
        `
      case 'reject':
        return Relay.QL`
          mutation { rejectTheme }
        `
    }
  }

  getFatQuery = () => {
    switch(this.props.action) {
      case 'subscribe':
        return Relay.QL`
          fragment on SubscribeOnThemePayload {
            theme
            user {
              themes
            }
          }
        `
      case 'unsubscribe':
        return Relay.QL`
          fragment on UnsubscribeFromThemePayload {
            theme
            user {
              themes
            }
          }
        `
      case 'reject':
        return Relay.QL`
          fragment on RejectThemePayload {
            theme
            user {
              themes
            }
          }
        `
    }
  }

  getVariables = () => ({
    id: this.props.theme.id
  })

  getConfigs = () => [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        theme:  this.props.theme.id,
        user:   this.props.user.id
      }
  }]

}
