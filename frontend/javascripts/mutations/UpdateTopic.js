import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    topic: () => Relay.QL` fragment on Topic { id } `
  }

  getMutation = () => Relay.QL`
    mutation { updateTopic }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on UpdateTopicPayload {
        topic {
          name
          description
        }
      }
    `

  getVariables = () => ({
    topicID:      this.props.topic.id,
    name:         this.props.name,
    description:  this.props.description
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: { topic: this.props.topic.id }
  }]

}
