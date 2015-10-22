import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    viewer: () => Relay.QL`fragment on User{id}`
  }

  getMutation = () => Relay.QL`mutation{updateThemeStatus}`

  getVariables() {
    return {
      themeID:  this.props.theme.id,
      status:   'rejected'
    }
  }

  getFatQuery = () =>
    Relay.QL`
      fragment on ThemeStatusMutationPayload {
        themeID,
        viewer {
          themes
        }
      }
    `

  getConfigs() {
    return [{
        type:               'RANGE_DELETE',
        parentName:         'viewer',
        parentID:           this.props.viewer.id,
        connectionName:     'themes',
        deletedIDFieldName: 'themeID',
        pathToConnection:   ['viewer', 'themes']
    }]
  }

}
