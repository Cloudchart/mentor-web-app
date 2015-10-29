import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    theme: () => Relay.QL`
      fragment on Theme { id }
    `
  }

  getMutation = () => Relay.QL`
    mutation { updateUserTheme }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on UpdateUserThemePayload {
        theme
      }
    `

  getVariables = () => ({
    id:     this.props.theme.id,
    status: this.props.status
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: {
      theme: this.props.theme.id
    }
  }]

}
