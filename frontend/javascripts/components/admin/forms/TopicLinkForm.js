import React from 'react'
import Relay from 'react-relay'

import {
  Card,
  CardActions,
  CardText,
  CardTitle,
  Dialog,
  Divider,
  FlatButton,
  LinearProgress,
  List,
  ListItem,
  SvgIcons,
  TextField,
} from 'material-ui'

import CancelIcon from 'material-ui/lib/svg-icons/navigation/cancel'

import InsightChooser from './InsightChooser'

import IntroduceLinkToTopicMutation from '../../../mutations/admin/IntroduceLinkToTopic'
import UpdateTopicLinkMutation from '../../../mutations/admin/UpdateTopicLink'

class TopicLinkForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isInsightChooserOpen: false
    }

    this._handleLinkURLChange = this._handleInputChange.bind(this, 'linkURL')
    this._handleLinkTitleChange = this._handleInputChange.bind(this, 'linkTitle')
    this._handleReactionContentChange = this._handleInputChange.bind(this, 'reactionContent')
  }

  componentWillMount() {
    this._updateStateFromProps(this.props)
  }

  _removeInsightAtIndex = (ii) => {
    this.setState({
      linkInsightsIDs: this.state.linkInsightsIDs.slice(0, ii).concat(this.state.linkInsightsIDs.slice(ii + 1))
    })
  }

  _updateStateFromProps(props) {
    this.setState({
      linkURL:          props.topicLink && props.topicLink.url || '',
      linkTitle:        props.topicLink && props.topicLink.title || '',
      reactionContent:  props.topicLink && props.topicLink.reaction && props.topicLink.reaction.content || '',
      linkInsightsIDs:  props.topicLink && props.topicLink.insights.edges.map(edge => edge.node.id) || [],
    })
  }

  _handleInputChange(field, event) {
    let nextState = {}
    nextState[field] = event.target.value
    this.setState(nextState)
  }

  _handleInsightSelect = (id) => {
    this.setState({
      linkInsightsIDs: this.state.linkInsightsIDs.concat(id)
    })
  }

  _showInsightChooser = () => {
    this.setState({
      isInsightChooserOpen: true
    })
  }

  _hideInsightChooser = () => {
    this.setState({
      isInsightChooserOpen: false
    })
  }

  _isValid = () => {
    return this.state.linkURL.trim().length > 0 &&
      this.state.linkTitle.trim().length > 0 &&
      // this.state.reactionContent.trim().length > 0 &&
      this.state.linkInsightsIDs.length > 0
  }

  _submit = () => {
    if (this.state.loading) return
    this.setState({ loading: true })
    this.props.topicLink
      ? this._update()
      : this._create()
  }

  _create = () => {
    Relay.Store.commitUpdate(
      new IntroduceLinkToTopicMutation({
        ...this.state,
        topicID: this.props.topic.id
      }),
      {
        onSuccess: this._handleSuccess,
        onFailure: this._handleFailure,
      }
    )
  }

  _update = () => {
    let mutation = new UpdateTopicLinkMutation({ ...this.state, linkID: this.props.topicLink.id })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this._handleSuccess,
      onFailure: this._handleFailure,
    })
  }

  _handleSuccess = (response) => {
    this.setState({ loading: false })
    this.props.onDone && this.props.onDone()
  }

  _handleFailure = (transaction) => {
    alert('Error!')
    this.setState({ loading: false })
  }

  _insightChooserDialogActions = () =>
    <FlatButton label="Done" primary={ true } onTouchTap={ this._hideInsightChooser } />

  render = () =>
    <Card style={{ margin: 20 }}>
      <CardTitle title="Add link" subtitle={ this.props.topic.name } />
      <CardText>
        <TextField floatingLabelText="Link URL" value={ this.state.linkURL } autoFocus={ true } onChange={ this._handleLinkURLChange } />
        <br />

        <TextField floatingLabelText="Link Title" value={ this.state.linkTitle } onChange={ this._handleLinkTitleChange } />
        <br />

        <TextField floatingLabelText="Boris said" value={ this.state.reactionContent } multiLine={ true } fullWidth={ true } onChange={ this._handleReactionContentChange } />

        <List>
          { this.state.linkInsightsIDs.map(this._renderInsight) }
        </List>

        <Dialog
          autoDetectWindowHeight  = { false }
          actions                 = { this._insightChooserDialogActions() }
          open                    = { this.state.isInsightChooserOpen }
          onRequestClose          = { this._hideInsightChooser }
        >
          <InsightChooser
            insights          = { this.props.topic.insights.edges.map(edge => edge.node) }
            selectedInsights  = { this.state.linkInsightsIDs }
            onSelect          = { this._handleInsightSelect }
          />
        </Dialog>
      </CardText>

      <Divider />

      <CardActions style={{ display: 'flex' }}>
        <FlatButton label="Add an insight" primary onTouchTap={ this._showInsightChooser } />
        <div style={{ flex: 1 }} />
        <FlatButton label="Cancel" secondary onTouchTap={ this.props.onCancel } />
        <FlatButton label="Save" primary disabled={ !this._isValid() } onTouchTap={ this._submit } />
      </CardActions>

    </Card>


  _renderInsight = (id, ii) =>
    <ListItem
      key         = { id }
      rightIcon   = { <CancelIcon /> }
      onTouchTap  = { () => this._removeInsightAtIndex(ii) }
    >
      { this.props.topic.insights.edges.find(edge => edge.node.id === id).node.content }
    </ListItem>

}


export default Relay.createContainer(TopicLinkForm, {

  initialVariables: {
    first: 1000,
  },

  fragments: {
    topicLink: () => Relay.QL`
      fragment on TopicLink {
        id
        url
        title
        reaction {
          content
        }
        insights(first: 1000) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,

    topic: () => Relay.QL`
      fragment on Topic {
        id
        name
        insights(filter: ADMIN, first: $first) {
          edges {
            node {
              id
              content
            }
          }
        }
      }
    `
  }

})
