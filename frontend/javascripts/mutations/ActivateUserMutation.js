import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User { id }
    `
  }

  getMutation = () => Relay.QL`
    mutation { activateUser }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on ActivateUserPayload {
        user
      }
    `

  getVariables = () => ({
    userId: this.props.user.id
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: {
      user: this.props.user.id
    }
  }]

}
