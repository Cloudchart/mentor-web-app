import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    userTheme: () => Relay.QL`
      fragment on UserTheme { id }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation { updateUserTheme }
    `
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UserThemeMutationPayload {
        userTheme { id, status }
      }
    `
  }

  getVariables() {
    return {
      id:       this.props.userTheme.id,
      status:   this.props.status
    }
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        userTheme: this.props.userTheme.id
      }
    }]
  }

}
