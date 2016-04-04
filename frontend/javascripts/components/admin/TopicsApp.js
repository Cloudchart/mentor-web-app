import React from 'react'
import Relay, {
  RootContainer
} from 'react-relay'

import {
  AppBar,
  Divider,
  List,
  ListItem,
} from 'material-ui'

import NodeRoute from '../../routes/NodeRoute'
import TopicApp from './TopicApp'


class TopicsApp extends React.Component {

  render = () =>
    <div>
      <List>
        { this.props.admin.topics.edges.map(this._renderTopic)}
      </List>
    </div>


  _renderTopics() {
    return (
      <ul>
        { this.props.admin.topics.edges.map(edge => this._renderTopic(edge.node)) }
      </ul>
    )
  }

  _renderTopic = (topicEdge) =>
    [
      <ListItem
        primaryText = { topicEdge.node.name }
        onTouchTap  = { () => this._handleTopicSelect(topicEdge.node) }
      />,
      <Divider />
    ]

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
