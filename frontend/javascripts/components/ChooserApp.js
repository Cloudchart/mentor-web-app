import React from 'react'
import Relay from 'react-relay'


class ChooserApp extends React.Component {

  render() {
    return (
      <div>
        <h2>Chooser</h2>
      </div>
    )
  }

}


export default Relay.createContainer(ChooserApp, {

  initialVariables: {
    count:  50,
    filter: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        themes(first: $count, filter: $filter) {
          count
          edges {
            node {
              name
            }
          }
        }
      }
    `
  }

})
