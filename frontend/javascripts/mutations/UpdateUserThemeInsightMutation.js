import Relay from 'react-relay'


function rangeDeleteConfig(name, parentID) {
  return {
    type:                 'RANGE_DELETE',
    parentName:           name,
    parentID:             parentID,
    connectionName:       'insights',
    deletedIDFieldName:   'insightID',
    pathToConnection:     [name, 'insights']
  }
}


export default class extends Relay.Mutation {

  static fragments = {
    user:     () => Relay.QL`fragment on User { id }`,
    insight:  () => Relay.QL`fragment on UserThemeInsight { id }`,
    theme:    () => Relay.QL`fragment on UserTheme { id }`,
  }

  getMutation = () => {
    switch(this.props.action) {
      case 'like':    return Relay.QL`mutation { likeInsight }`
      case 'dislike': return Relay.QL`mutation { dislikeInsight }`
      case 'reset':   return Relay.QL`mutation { resetInsight }`
    }
  }

  getFatQuery = () => {
    switch (this.props.action) {
      case 'like':
        return Relay.QL`
          fragment on LikeInsightPayload {
            insight insightID
            theme { insights }
            user { insights }
          }
        `
      case 'dislike':
        return Relay.QL`
          fragment on DislikeInsightPayload {
            insight insightID
            theme { insights }
            user { insights }
          }
        `
      case 'reset':
        return Relay.QL`
          fragment on ResetInsightPayload {
            insight insightID
            theme { insights }
            user { insights }
          }
        `
    }
  }

  getVariables = () => ({
    id: this.props.insight.id
  })

  getConfigs = () => {
    let config = [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user:     this.props.user ? this.props.user.id : null, // NB: Fix an error WIP by Relay Team
        theme:    this.props.theme ? this.props.theme.id : null,
        insight:  this.props.insight.id
      }
    }]

    if (this.props.user && this.props.action !== 'reset')
      config.push(rangeDeleteConfig('user', this.props.user.id))

    if (this.props.theme && this.props.action !== 'reset')
      config.push(rangeDeleteConfig('theme', this.props.theme.id))

    return config
  }

}
