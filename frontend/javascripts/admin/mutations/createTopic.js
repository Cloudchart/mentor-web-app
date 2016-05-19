import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    admin: () => Relay.QL`
      fragment on Admin {
        id
      }
    `
  }

  getMutation = () => Relay.QL`
    mutation { createTopic }
  `

  getVariables = () => ({
    name        : this.props.name,
    description : this.props.description,
  })

  getFatQuery = () => Relay.QL`
    fragment on CreateTopicPayload {
      topicEdge
      admin
    }
  `

  getConfigs = () => [
    {
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
