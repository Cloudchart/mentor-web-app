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
    mutation { createInsight }
  `

  getVariables = () => ({
    content: this.props.content,
    author: this.props.author,
    url: this.props.url,
  })

  getFatQuery = () => Relay.QL`
    fragment on CreateInsightPayload {
      insightEdge
      admin
    }
  `

  getConfigs = () => [
    {
      type: 'RANGE_ADD',
      parentName: 'admin',
      parentID: this.props.admin.id,
      connectionName: 'insights',
      edgeName: 'insightEdge',
      rangeBehaviors: {
        '': 'prepend',
      }
    }
  ]

}
