import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User { id }
    `
  }

  getMutation = () =>
    Relay.QL`
      mutation { createTheme }
    `

  getFatQuery = () =>
    Relay.QL`
      fragment on CreateThemeMutationPayload {
        viewer {
          themes
        }
      }
    `

  getVariables = () => ({
    name:   this.props.name
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: {
      viewer: this.props.viewer.id
    }
  }]

}
