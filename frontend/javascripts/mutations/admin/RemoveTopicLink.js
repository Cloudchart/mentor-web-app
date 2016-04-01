import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { removeTopicLink }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on RemoveTopicLinkPayload {
        linkID
        topic {
          links
        }
      }
    `

  getVariables = () => ({
    linkID:   this.props.linkID,
  })

  getConfigs = () => [{
    type: 'NODE_DELETE',
    parentName: 'topic',
    parentID: this.props.topicID,
    connectionName: 'links',
    deletedIDFieldName: 'linkID',
  }]

}
