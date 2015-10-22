import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`mutation{createTheme}`

  getVariables() {
    return {
      name: this.props.name
    }
  }

  getFatQuery = () => Relay.QL`
    fragment on CreateThemeMutationPayload {
      themeID
      theme
    }
  `

  getConfigs = () => []

}
