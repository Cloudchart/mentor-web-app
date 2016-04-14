import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    topic: () => Relay.QL` fragment on Topic { id } `
  }

  getMutation = () => Relay.QL`
    mutation { refreshTopic }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on RefreshTopicPayload {
        topic {
          insights
        }
      }
    `

  getVariables = () => ({
    topicID:  this.props.topic.id,
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: { topic: this.props.topic.id }
  }]

}
