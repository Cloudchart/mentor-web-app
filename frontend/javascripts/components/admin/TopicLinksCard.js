import React from 'react'
import Relay from 'react-relay'

import {
  Card,
  CardHeader,
  CardActions,
  Checkbox,
  Divider,
  FlatButton,
  IconButton,
  IconMenu,
  MenuItem,
  List,
  ListItem,
  Subheader,
} from 'material-ui'

import Close from 'material-ui/lib/svg-icons/navigation/close'

import TopicLinkForm from './forms/TopicLinkForm'

import RemoveTopicLinkMutation from '../../mutations/admin/RemoveTopicLink'

const RightIconButton = (callback) =>
  <IconButton onTouchTap={ () => { if (confirm('Are you sure?')) { callback() } } }>
    <Close color="red" />
  </IconButton>



class TopicLinksCard extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      topicLink: undefined
    }
  }

  _handleRemoveRequest = (id) => {
    Relay.Store.commitUpdate(
      new RemoveTopicLinkMutation({
        topicID:  this.props.topic.id,
        linkID:   id,
      })
    )
  }

  render = () =>
    this.state.topicLink === undefined
      ? this.renderList()
      : this.renderForm()

  renderList = () =>
    <Card style={{ margin: 20 }}>
      <List>
        {
          this.props.topic.links.edges.length > 0
            ? this.props.topic.links.edges.map(edge => this._renderTopicLink(edge.node))
            : this._renderEmptyTopicListItem()
        }

      </List>
      <Divider />
      <CardActions>
        <FlatButton label="Add link" primary onTouchTap={() => this.setState({ topicLink: null })} />
      </CardActions>
    </Card>

  renderForm = () =>
    <TopicLinkForm
      topic     = { this.props.topic }
      topicLink = { this.state.topicLink }
      onCancel  = { () => this.setState({ topicLink: undefined }) }
      onDone    = { () => this.setState({ topicLink: undefined }) }
    />

  _renderTopicLink = (topicLink) =>
    <ListItem
      key             = { topicLink.id }
      nestedItems     = { topicLink.insights.edges.map(edge => this._renderInsight(edge.node)) }
      onTouchTap      = { () => this.setState({ topicLink }) }
      secondaryText   = { topicLink.reaction && topicLink.reaction.content || '' }
      rightIconButton = { RightIconButton(this._handleRemoveRequest.bind(this, topicLink.id)) }
    >
      <a href={ topicLink.url } target="_blank">{ topicLink.title }</a>
    </ListItem>

  _renderEmptyTopicListItem = () =>
    <ListItem disabled>No links</ListItem>

  _renderInsight = (insight) =>
    <ListItem key={ insight.id } disabled>{ insight.content }</ListItem>


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
              reaction {
                content
              }
              insights(first: 100) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
        }
      }
    `
  }

})
