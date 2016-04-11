import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { removeAnswer }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on RemoveAnswerPayload {
        question { answers }
        answerID
      }
    `

  getVariables = () => ({
    answerID: this.props.answerID,
  })

  getConfigs = () => [{
    type: 'NODE_DELETE',
    parentName: 'question',
    parentID: this.props.questionID,
    connectionName: 'answers',
    deletedIDFieldName: 'answerID',
  }]

}
