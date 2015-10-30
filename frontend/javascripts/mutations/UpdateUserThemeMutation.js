import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    userTheme: () => Relay.QL`
      fragment on UserTheme { id }
    `
  }

  getMutation = () => Relay.QL`
    mutation { updateUserTheme }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on UpdateUserThemePayload {
        userTheme
        user
      }
    `

  getVariables = () => ({
    id:       this.props.userTheme.id,
    status:   this.props.status
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: {
      userTheme: this.props.userTheme.id
    }
  }]

}
