import Relay from 'react-relay'

const Environment = new Relay.Environment()

Environment.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
)


export default Environment
