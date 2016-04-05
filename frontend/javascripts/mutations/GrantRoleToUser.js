import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { grantRoleToUser }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on GrantRoleToUserPayload {
        user { roles }
        roleEdge
      }
    `

  getVariables = () => ({
    userID:   this.props.userID,
    roleName: this.props.roleName,
  })

  getConfigs = () => [{
    type: 'RANGE_ADD',
    parentName: 'user',
    parentID: this.props.userID,
    connectionName: 'roles',
    edgeName: 'roleEdge',
    rangeBehaviors: {
      '': 'append'
    }
  }]

}
