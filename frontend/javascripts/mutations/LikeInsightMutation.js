import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    userThemeInsight: () => Relay.QL`
      fragment on UserThemeInsight {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation { likeInsight }
    `
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LikeInsightMutationPayload {
        updatedInsight {
          id
          rate
        }
      }
    `
  }

  getVariables() {
    return {
      id:   this.props.userThemeInsight.id,
      rate: this.props.rate
    }
  }


  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        updatedInsight: this.props.userThemeInsight.id
      }
    }]
  }

}
