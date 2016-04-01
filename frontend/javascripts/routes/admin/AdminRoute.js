import Relay from 'react-relay'

export default class extends Relay.Route {

  static queries = {
    admin: () => Relay.QL`
      query { admin }
    `
  }

  static routeName = 'Admin'

}
