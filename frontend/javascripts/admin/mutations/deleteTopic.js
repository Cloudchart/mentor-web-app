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
    mutation { deleteTopic }
  `

  getVariables = () => ({
    topicID: this.props.topic.id,
  })

  getFatQuery = () => Relay.QL`
    fragment on DeleteTopicPayload {
      topicID
      admin {
        topics
      }
    }
  `

  getConfigs = () => [
    {
      type: 'NODE_DELETE',
      parentName: 'admin',
      parentID: this.props.admin.id,
      connectionName: 'topics',
      deletedIDFieldName: 'topicID',
    }
  ]

}
