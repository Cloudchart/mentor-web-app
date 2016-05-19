import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    admin: () => Relay.QL`
      fragment on Admin {
        id
      }
    `,
    topic: () => Relay.QL`
      fragment on Topic {
        id
      }
    `
  }

  getMutation = () => Relay.QL`
    mutation { updateTopic }
  `

  getVariables = () => ({
    topicID     : this.props.topic.id,
    name        : this.props.name,
    description : this.props.description,
  })

  getFatQuery = () => Relay.QL`
    fragment on UpdateTopicPayload {
      topic {
        name
        description
      }
      topicEdge
      admin {
        topics
      }
    }
  `

  getConfigs = () => [
    {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        topic: this.props.topic.id
      }
    }, {
      type: 'RANGE_ADD',
      parentName: 'admin',
      parentID: this.props.admin.id,
      connectionName: 'topics',
      edgeName: 'topicEdge',
      rangeBehaviors: {
        '': 'refetch',
      }
    }
  ]

}
