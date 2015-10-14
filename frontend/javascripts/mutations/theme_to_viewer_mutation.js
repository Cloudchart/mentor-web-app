import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{themeToViewer}`
  }

  getVariables() {
    return {
      themeId:  this.props.theme.id,
      action:   this.props.theme.isSelectedByViewer ? 'remove' : 'add'
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on ThemeToViewerPayload {
        theme {
          isSelectedByViewer
        }
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          theme: this.props.theme.id
        }
      }
    ]
  }

  static fragments = {
    theme: () => Relay.QL`
      fragment on Theme {
        id
        isSelectedByViewer
      }
    `
  }

}
