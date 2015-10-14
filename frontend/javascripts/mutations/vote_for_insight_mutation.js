import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{voteForInsight}`
  }

  getVariables() {
    return {
      themeID:    this.props.theme.id,
      insightID:  this.props.insight.id,
      isPositive: this.props.isPositive
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on VoteForInsightPayload {
        insightID
        insightEdge
        theme {
          viewerInsights
        }
        viewer {
          favoriteInsights
        }
      }
    `
  }

  getConfigs() {
    let configs = [{
      type:             'RANGE_ADD',
      parentName:       'theme',
      parentID:         this.props.theme.id,
      connectionName:   'viewerInsights',
      edgeName:         'insightEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }];

    if (this.props.isPositive) {
      configs = configs.concat(this.getPositiveConfigs())
    } else {
      configs = configs.concat(this.getNegativeConfigs())
    }

    return configs
  }


  getNegativeConfigs() {
    return [{
      type:                 'NODE_DELETE',
      parentName:           'viewer',
      parentID:             this.props.viewer.id,
      connectionName:       'favoriteInsights',
      deletedIDFieldName:   'insightID'
    }]
  }

  getPositiveConfigs() {
    return []
  }


  static fragments = {
    theme() {
      return Relay.QL`
        fragment on Theme { id }
      `
    },

    viewer() {
      return Relay.QL`
        fragment on User { id }
      `
    }
  }

}
