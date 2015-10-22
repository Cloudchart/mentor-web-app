import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on User { id }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation { activateViewer }
    `
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ActivateViewerPayload {
        viewer { isActive }
      }
    `
  }

  getVariables() {
    return {}
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id
      }
    }]
  }

}
