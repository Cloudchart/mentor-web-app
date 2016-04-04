import React from 'react'
import Relay from 'react-relay'

import AdminRoute from '../../routes/admin/AdminRoute'

import TopicsApp from './TopicsApp'

import {
  Divider,
  List,
  ListItem,
} from 'material-ui'

const Types = {
  'topics': {
    title: 'Topics',
    Component:  TopicsApp,
    Route:      AdminRoute,
  }
}


class Chooser extends React.Component {

  render = () =>
    <div>
      <List>
        { Object.keys(Types).map(key => this._renderType(key)) }
      </List>
    </div>

  _renderType = (key) =>
    [
      <ListItem
        primaryText = { Types[key].title }
        onTouchTap  = { () => this._handleTypeClick(key) }
      />,
      <Divider />
    ]

  _handleTypeClick = (key) => {
    this.props.navigator.push(Types[key])
  }

}

export default Chooser
