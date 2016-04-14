import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { removeQuestion }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on RemoveQuestionMutationPayload {
        admin
        questionID
      }
    `

  getVariables = () => ({
    questionID: this.props.questionID,
  })

  getConfigs = () => [{
    type:               'NODE_DELETE',
    parentName:         'admin',
    parentID:           this.props.adminID,
    connectionName:     'questions',
    deletedIDFieldName: 'questionID',
  }]

}
