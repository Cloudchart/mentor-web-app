import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    question: () => Relay.QL` fragment on Question { id } `
  };

  getMutation = () => Relay.QL`
    mutation { updateQuestion }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on UpdateQuestionPayload {
        question {
          content
          severity
        }
      }
    `

  getVariables = () => ({
    questionID: this.props.question.id,
    content:    this.props.content,
    severity:   this.props.severity,
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: { question: this.props.question.id }
  }]

}
