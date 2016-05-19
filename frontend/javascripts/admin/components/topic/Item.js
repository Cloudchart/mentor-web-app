import React from 'react'
import Relay from 'react-relay'

import Toggle from 'material-ui/Toggle'
import IconButton from 'material-ui/IconButton'
import { ListItem } from 'material-ui/List'
import ClearIcon from 'material-ui/svg-icons/content/clear'

import ItemMenu from 'admin/components/shared/ItemMenu'

import {
  deepOrange500 as clearIconColor,
  indigo500 as defaultTopicBorderColor,
} from 'material-ui/styles/colors'


class TopicItem extends React.Component {

  static propTypes = {
    onRequest: React.PropTypes.func,
    onUpdateRequest: React.PropTypes.func,
    onDeleteRequest: React.PropTypes.func,
  }


  handleUpdateRequest = () =>
    this.props.onUpdateRequest && this.props.onUpdateRequest(this.props.topic.id)

  handleDeleteRequest = () =>
    this.props.onDeleteRequest && this.props.onDeleteRequest(this.props.topic.id)


  render = () => {
    let style = Styles.item

    if (this.props.topic.isDefault )
      style = { ...style, ...Styles.defaultItem }

    return (
      <ListItem
        secondaryText   = { this.props.topic.description }
        style           = { style }
        rightIconButton = {
          ItemMenu({
            onUpdateRequest: this.handleUpdateRequest,
            onDeleteRequest: this.handleDeleteRequest
          })
        }
      >
        { this.props.topic.name }
      </ListItem>
    )
  }

}


const Styles = {
  item: {
    borderLeftColor: 'transparent',
    borderLeftStyle: 'solid',
    borderLeftWidth: 2,
  },

  defaultItem: {
    borderLeftColor: defaultTopicBorderColor
  },

}


export default Relay.createContainer(TopicItem, {

  fragments: {
    topic: () => Relay.QL`
      fragment on Topic {
        id
        name
        description
        isDefault
      }
    `
  }

})
