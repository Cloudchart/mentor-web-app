import Relay from 'react-relay'

export default class extends Relay.Route {

  static queries = {
    themes: () => Relay.QL`
      query { themes }
    `
  }

  static paramDefinitions = {
    filter: { required: true }
  }

  static routeName = 'Themes'

}
