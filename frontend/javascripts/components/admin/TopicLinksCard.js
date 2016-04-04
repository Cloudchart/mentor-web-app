import React from 'react'
import Relay from 'react-relay'

import {
  Card,
  CardTitle,
  CardActions,
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui'

import TopicLinkForm from './forms/TopicLinkForm'


class TopicLinksCard extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      shouldRenderDialog: false
    }

    this._handleAddLink = this._handleAddLink.bind(this)
  }

  render = () =>
    <div>
      <Card>
        <CardActions>
          <FlatButton label="Add Link" primary={ true } onTouchTap={ this._handleAddLink } />
        </CardActions>
      </Card>
      <Dialog
        autoDetectWindowHeight = { false }
        title="Add new link"
        actions = { this._renderActions() }
        open={ this.state.shouldRenderDialog }
        onRequestClose = { () => this.setState({ shouldRenderDialog: false }) }
        repositionOnUpdate = { false }
      >
        <TopicLinkForm topicLink={ null } topic={ this.props.topic } />
      </Dialog>
    </div>

  _handleAddLink() {
    this.setState({ shouldRenderDialog: true })
  }

  _renderActions() {
    return [
      <FlatButton label="Cancel" secondary={ true } onTouchTap={ () => this.setState({ shouldRenderDialog: false }) } />
      ,
      <FlatButton label="Save" primary={ true } />
    ]
  }

}


export default Relay.createContainer(TopicLinksCard, {

  fragments: {
    topic: () => Relay.QL`
      fragment on Topic {
        ${TopicLinkForm.getFragment('topic')}
        id
        links(first: 100) {
          edges {
            node {
              ${TopicLinkForm.getFragment('topicLink')}
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
