import Relay from 'react-relay'


let rangeDeleteConfig = (parentName, parentID) => ({
  type:               'RANGE_DELETE',
  parentName:         parentName,
  parentID:           parentID,
  connectionName:     'insights',
  deletedIDFieldName: 'insightID',
  pathToConnection:   [parentName, 'insights']
})

export default class extends Relay.Mutation {

  static fragments = {
    insight: () => Relay.QL`
      fragment on UserThemeInsight { id, rate }
    `
  }

  getMutation = () =>
    Relay.QL`
      mutation { updateUserThemeInsight }
    `

  getFatQuery = () =>
    Relay.QL`
      fragment on UpdateUserThemeInsightMutationPayload {
        insightID
        insight
        viewer
      }
    `

  getVariables = () => ({
    id:   this.props.insight.id,
    rate: this.props.rate
  })

  getConfigs() {
    let configs = []

    configs.push({
      type: 'FIELDS_CHANGE',
      fieldIDs: { insight: this.props.insight.id }
    })

    if (this.props.viewer)
      configs.push(rangeDeleteConfig('viewer', this.props.viewer.id))

    return configs
  }

}
