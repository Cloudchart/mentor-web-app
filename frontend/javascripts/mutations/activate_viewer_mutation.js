import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () =>
    Relay.QL`
      mutation { activateViewer }
    `

  getVariables = () => {}

  getFatQuery = () =>
    Relay.QL`
      fragment on ActivateViewerPayload {
        viewer {
          is_active
        }
      }
    `

  getConfigs = () =>
    [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id
        }
      }
    ]

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id
        is_active
      }
    `
  }

}
