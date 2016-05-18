import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    insight: () => Relay.QL`
      fragment on Insight {
        id
      }
    `
  }

  getMutation = () => Relay.QL`
    mutation { updateInsight }
  `

  getVariables = () => ({
    insightID: this.props.insight.id,
    content: this.props.content,
    author: this.props.author,
    url: this.props.url,
  })

  getFatQuery = () => Relay.QL`
    fragment on UpdateInsightPayload {
      insight {
        content
        origin
      }
    }
  `

  getConfigs = () => [
    {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        insight: this.props.insight.id
      }
    }
  ]

}
