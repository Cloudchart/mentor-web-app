import Relay from 'react-relay'


export default class extends Relay.Route {

  static queries = {

    theme: () => Relay.QL`
      query {
        theme(id: $themeID)
      }
    `

  }

  static paramDefinitions = {
    themeID: { required: true }
  }

  static routeName = 'ThemeAppRoute'

}
