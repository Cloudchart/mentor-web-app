import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    theme: () => Relay.QL`fragment on Theme{id}`
  }

  getMutation = () => Relay.QL`mutation{updateThemeStatus}`

  getVariables() {
    return {
      themeID:  this.props.theme.id,
      status:   this.props.status
    }
  }

  getFatQuery = () =>
    Relay.QL`
      fragment on ThemeStatusMutationPayload {
        theme {
          isVisible
          isSubscribed
          isRejected
        }
      }
    `

  getConfigs() {
    return [{
        type:       'FIELDS_CHANGE',
        fieldIDs:   {
          theme:  this.props.theme.id
        }
    }]
  }

}
