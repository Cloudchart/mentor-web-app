import Relay from 'react-relay'

export default class extends Relay.Route {

  static queries = {
    node: () => Relay.QL`
      query { node(id: $id) }
    `
  }

  static routeName = 'Node'

}
