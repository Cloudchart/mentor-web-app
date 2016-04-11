import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () =>
    this.props.status
      ? Relay.QL` mutation { publishQuestion } `
      : Relay.QL` mutation { unpublishQuestion } `

  getFatQuery = () =>
    this.props.status
      ? Relay.QL` fragment on PublishQuestionMutationPayload { question { isPublished } } `
      : Relay.QL` fragment on UnpublishQuestionMutationPayload { question { isPublished } } `

  getVariables = () => ({
    questionID: this.props.questionID
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: { question: this.props.questionID }
  }]

}
