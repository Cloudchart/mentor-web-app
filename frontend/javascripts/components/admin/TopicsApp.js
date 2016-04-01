import React from 'react'
import Relay, {
  RootContainer
} from 'react-relay'

import NodeRoute from '../../routes/NodeRoute'
import TopicApp from './TopicApp'


class TopicsApp extends React.Component {

  componentDidMount() {
    this._loadMoreTopics()
  }

  componentDidUpdate() {
    this._loadMoreTopics()
  }

  render() {
    return (
      <div>
        <div onClick={ event => this.props.navigator.pop() }>&lt; Back</div>
        { this._renderTopics() }
      </div>
    )
  }

  _renderTopics() {
    return (
      <ul>
        { this.props.admin.topics.edges.map(edge => this._renderTopic(edge.node)) }
      </ul>
    )
  }

  _renderTopic(topic) {
    return (
      <li key={ topic.id }>
        <a href="#" onClick={ event => this._handleTopicClick(event, topic.id) }>
          { topic.name }
        </a>
      </li>
    )
  }

  _handleTopicClick(event, id) {
    event.preventDefault()
    this.props.navigator.push({
      Component:  TopicApp,
      Route:      NodeRoute,
      props:      { id },
    })
  }

  _loadMoreTopics() {
    if (this.props.admin.topics.pageInfo.hasNextPage)
      setTimeout(() => {
        this.props.relay.setVariables({
          first: this.props.relay.variables.first + 5
        })
      })
  }

}


export default Relay.createContainer(TopicsApp, {

  initialVariables: {
    first: 5
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
