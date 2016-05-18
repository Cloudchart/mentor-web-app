import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    admin: () => Relay.QL`
      fragment on Admin {
        id
      }
    `,
    insight: () => Relay.QL`
      fragment on Insight {
        id
      }
    `
  }

  getMutation = () => Relay.QL`
    mutation { deleteInsight }
  `

  getVariables = () => ({
    insightID: this.props.insight.id,
  })

  getFatQuery = () => Relay.QL`
    fragment on DeleteInsightPayload {
      insightID
      admin {
        insights
      }
    }
  `

  getConfigs = () => [
    {
      type: 'NODE_DELETE',
      parentName: 'admin',
      parentID: this.props.admin.id,
      connectionName: 'insights',
      deletedIDFieldName: 'insightID',
    }
  ]

}
