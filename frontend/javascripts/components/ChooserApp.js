import React from 'react'
import Relay from 'react-relay'


class ChooserApp extends React.Component {


  componentDidMount() {
    console.log(this.props.relay.variables)
  }


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
    themes: () => Relay.QL`
      fragment on ThemesConnection {
        edges {
          node {
            name
          }
        }
      }
    `
  }

})
