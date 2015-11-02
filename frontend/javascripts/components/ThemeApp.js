import React from 'react'
import Relay from 'react-relay'


class ThemeApp extends React.Component {


  render() {
    return (
      <div>
        <h2>
          { `#${this.props.viewer.theme.name}` }
        </h2>
      </div>
    )
  }

}


export default Relay.createContainer(ThemeApp, {

  initialVariables: {
    themeID: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        theme(id: $themeID) {
          id
          name
          insights(first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `
  }

})
