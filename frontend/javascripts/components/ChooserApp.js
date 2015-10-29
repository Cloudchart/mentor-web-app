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

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        name
      }
    `
  }

})
