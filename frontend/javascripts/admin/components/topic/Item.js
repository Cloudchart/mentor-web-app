import React from 'react'
import Relay from 'react-relay'

import { ListItem } from 'material-ui/List'


class TopicItem extends React.Component {

  static propTypes = {
    onRequest: React.PropTypes.func,
    onUpdateRequest: React.PropTypes.func,
    onDeleteRequest: React.PropTypes.func,
  }

  render = () => {
    return (
      <ListItem
        secondaryText = { this.props.topic.description }
        onTouchTap    = { this.props.onRequest }
      >
        <div>{ this.props.topic.name }</div>
      </ListItem>
    )
  }

}

export default Relay.createContainer(TopicItem, {

  fragments: {
    topic: () => Relay.QL`
      fragment on Topic {
        id
        name
        description
      }
    `
  }

})
