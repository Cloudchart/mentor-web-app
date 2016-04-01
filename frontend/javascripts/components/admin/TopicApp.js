import React from 'react'
import Relay, {
  RootContainer
} from 'react-relay'

import RemoveTopicLinkMutation from '../../mutations/admin/RemoveTopicLink'

import TopicLinkForm from './forms/TopicLinkForm'


class TopicsApp extends React.Component {

  state = {
    inAddLinkMode: false
  }

  render() {
    return (
      <div>
        { this.props.node.name }
        <ul>
          { this._renderLinks() }
          { this._renderAddLinkButton() }
          { this._renderTopicLinkForm() }
        </ul>
      </div>
    )
  }

  _renderLinks() {
    if (this.state.inAddLinkMode) return null

    return this.props.node.links.edges.length > 0
      ? this.props.node.links.edges.map(edge => this._renderLink(edge.node))
      : <li>no links</li>
  }

  _renderLink(link) {
    return (
      <li key={ link.id }>
        { link.title }
        <span> </span>
        <a href="#" onClick={ event => this._handleRemoveLink(event, link.id) }>[x]</a>
      </li>
    )
  }

  _renderAddLinkButton() {
    if (this.state.inAddLinkMode) return null

    return (
      <li>
        <button onClick={ event => this.setState({ inAddLinkMode: true }) }>Add link</button>
      </li>
    )
  }

  _renderTopicLinkForm() {
    if (!this.state.inAddLinkMode) return null

    return <TopicLinkForm
      topicID   = { this.props.node.id }
      onDone    = { () => this.setState({ inAddLinkMode: false }) }
      onCancel  = { () => this.setState({ inAddLinkMode: false }) }
    />
  }

  _handleRemoveLink(event, linkID) {
    event.preventDefault()
    if (!confirm('Are you sure?')) return
    Relay.Store.update(new RemoveTopicLinkMutation({
      linkID,
      topicID: this.props.node.id,
    }), {
      onFailure: () => alert('Shit happens :)')
    })
  }

}


export default Relay.createContainer(TopicsApp, {

  initialVariables: {
    firstLinks: 10,
  },

  fragments: {
    node: () => Relay.QL`
      fragment on Topic {
        id
        name
        links(first: $firstLinks) {
          edges {
            node {
              id
              url
              title
            }
          }
        }
      }
    `
  }

})
