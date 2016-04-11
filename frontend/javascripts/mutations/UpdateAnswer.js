import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { updateAnswer }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on UpdateAnswerPayload {
        answer {
          content
        }
      }
    `

  getVariables = () => ({
    answerID:   this.props.answerID,
    content:    this.props.content,
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: { answer: this.props.answerID }
  }]

}
