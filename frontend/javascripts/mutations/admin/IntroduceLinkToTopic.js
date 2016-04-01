import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { introduceLinkToTopic }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on IntroduceLinkToTopicPayload {
        topic { links }
        linkEdge
      }
    `

  getVariables = () => ({
    topicID:          this.props.topicID,
    linkURL:          this.props.linkURL,
    linkTitle:        this.props.linkTitle,
    linkInsightsIDs:  this.props.linkInsightsIDs,
  })

  getConfigs = () => [{
    type: 'RANGE_ADD',
    parentName: 'topic',
    parentID: this.props.topicID,
    connectionName: 'links',
    edgeName: 'linkEdge',
    rangeBehaviors: {
      '': 'append'
    }
  }]

}
