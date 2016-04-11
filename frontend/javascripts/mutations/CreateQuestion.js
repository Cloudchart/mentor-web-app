import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { createQuestion }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on CreateQuestionMutationPayload {
        admin { questions }
        questionEdge
      }
    `

  getVariables = () => ({
    content:  this.props.content,
    severity: this.props.severity,
  })

  getConfigs = () => [{
    type: 'RANGE_ADD',
    parentName: 'admin',
    parentID: this.props.adminID,
    connectionName: 'questions',
    edgeName: 'questionEdge',
    rangeBehaviors: {
      '': 'prepend'
    }
  }]

}
