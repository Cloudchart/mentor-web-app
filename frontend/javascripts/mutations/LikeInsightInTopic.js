import Relay from 'react-relay'

export default class LikeInsightInTopic extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User { id }
    `,
    topic: () => Relay.QL`
      fragment on Topic { id }
    `,
    insight: () => Relay.QL`
      fragment on Insight { id }
    `
  }

  getMutation = () => Relay.QL`
    mutation { likeInsightInTopic }
  `

  getFatQuery = () => Relay.QL`
    fragment on LikeInsightInTopicMutationPayload {
      topic {
        isFinishedByViewer
      }
      insightID
      user {
        insights
        collections(first: 100) {
          edges {
            node {
              insights {
                usefulCount
              }
            }
          }
        }
      }
    }
  `

  getVariables = () => ({
    topicID: this.props.topic.id,
    insightID: this.props.insight.id,
    shouldAddToUserCollectionWithTopicName: true,
  })

  getConfigs = () => [
    {
      type: 'NODE_DELETE',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'insights',
      deletedIDFieldName: 'insightID'
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: { topic: this.props.topic.id }
    }
  ]

}
