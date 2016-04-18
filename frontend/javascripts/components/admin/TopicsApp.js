import React from 'react'
import Relay, {
  RootContainer
} from 'react-relay'

import {
  AppBar,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
} from 'material-ui'

import Edit from 'material-ui/svg-icons/editor/mode-edit'

import NodeRoute from '../../routes/NodeRoute'
import TopicApp from './TopicApp'


const EditTopicButton = ({ onTouchTap }) =>
  <IconButton
    onTouchTap = { onTouchTap }
    style={{ position: 'absolute', right: 20, top: 0 }}
  >
    <Edit />
  </IconButton>


class TopicsApp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      topic: null
    }
  }

  render = () =>
    <Paper style={{ margin: 20 }}>
      <List>
        { this.props.admin.topics.edges.map(this._renderTopic)}
      </List>
    </Paper>


  _renderTopic = (topicEdge) =>
    <ListItem
      key             = { topicEdge.node.id }
      primaryText     = { topicEdge.node.name }
      onTouchTap      = { () => this._handleTopicSelect(topicEdge.node) }
      rightIconButton = { <EditTopicButton onTouchTap={ () => this.setState({ topic: topicEdge.node }) } /> }
    />

  _handleTopicSelect = (node) =>
    this.props.navigator.push({ Component: TopicApp, Route: NodeRoute, props: { id: node.id }, title: `Topics / ${node.name}` })

}


export default Relay.createContainer(TopicsApp, {

  initialVariables: {
    first: 100
  },

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        id
        topics(first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `
  }

})
