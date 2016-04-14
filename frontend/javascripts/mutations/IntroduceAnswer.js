import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { introduceAnswer }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on IntroduceAnswerPayload {
        question { answers }
        answerEdge
      }
    `

  getVariables = () => ({
    questionID: this.props.questionID,
    content:    this.props.content,
  })

  getConfigs = () => [{
    type: 'RANGE_ADD',
    parentName: 'question',
    parentID: this.props.questionID,
    connectionName: 'answers',
    edgeName: 'answerEdge',
    rangeBehaviors: {
      '': 'append'
    }
  }]

  getOptimisticResponse = () => {
    return {
      answerEdge: {
        node: {
          content: this.props.content
        }
      }
    }
  }

}
