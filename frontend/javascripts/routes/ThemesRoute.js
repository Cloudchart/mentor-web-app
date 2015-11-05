import Relay from 'react-relay'

export default class extends Relay.Route {

  static queries = {
    viewer: () => Relay.QL`
      query { viewer }
    `
  }

  static paramDefinitions = {
    filter: { required: true }
  }

  static routeName = 'Themes'

}
