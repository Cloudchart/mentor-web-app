import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { revokeRoleFromUser }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on RevokeRoleFromUserPayload {
        roleID
        user {
          roles
        }
      }
    `

  getVariables = () => ({
    userID:   this.props.userID,
    roleName: this.props.roleName,
  })

  getConfigs = () => [{
    type: 'NODE_DELETE',
    parentName: 'user',
    parentID: this.props.userID,
    connectionName: 'roles',
    deletedIDFieldName: 'roleID',
  }]

}
