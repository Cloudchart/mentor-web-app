import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { updateTopicLink }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on UpdateTopicLinkPayload {
        link
      }
    `

  getVariables = () => ({
    linkID:           this.props.linkID,
    linkURL:          this.props.linkURL,
    linkTitle:        this.props.linkTitle,
    reactionContent:  this.props.reactionContent,
    linkInsightsIDs:  this.props.linkInsightsIDs,
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: { link: this.props.linkID }
  }]

}
