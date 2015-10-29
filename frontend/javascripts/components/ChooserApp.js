import React from 'react'
import Relay from 'react-relay'


const MaxSubscriptionsCount = 3


class ChooserApp extends React.Component {


  handleSubscribe(theme, event) {
    event.preventDefault()
  }

  handleUnsubscribe(theme, event) {
    event.preventDefault()
  }


  render() {
    return (
      <div>
        <h2>Choose {MaxSubscriptionsCount} topics to continue</h2>
        <ul style={{ listStyle: 'none', margin: '0', padding: '0' }}>
          { this.props.viewer.themes.edges.map(this.renderTheme) }
        </ul>
      </div>
    )
  }

  renderTheme = (themeEdge) => {
    let theme = themeEdge.node
    return (
      <li key={ theme.id } style={{ margin: '10px 0' }}>
        #{ theme.name }
        <div>
          { this.renderSubscribeOnThemeControl(theme) }
          { this.renderUnsubscribeFromThemeControl(theme) }
        </div>
      </li>
    )
  }

  renderSubscribeOnThemeControl(theme) {
    return theme.isSubscribed
      ? null
      : <a href="#" onClick={ this.handleSubscribe.bind(this, theme) } style={{ color: 'blue' }}>Subscribe</a>
  }

  renderUnsubscribeFromThemeControl(theme) {
    return theme.isSubscribed
      ? <a href="#" onClick={ this.handleUnsubscribe.bind(this, theme) } style={{ color: 'red' }}>Unsubscribe</a>
      : null
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
              id
              name
              isSubscribed
            }
          }
        }
      }
    `
  }

})
