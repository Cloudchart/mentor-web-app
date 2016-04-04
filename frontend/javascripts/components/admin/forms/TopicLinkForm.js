import React from 'react'
import Relay from 'react-relay'

import {
  Dialog,
  FlatButton,
  List,
  ListItem,
  TextField,
} from 'material-ui'

import InsightChooser from './InsightChooser'


class TopicLinkForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isInsightChooserOpen: false
    }
  }

  componentWillMount() {
    this._updateStateFromProps(this.props)
  }

  _updateStateFromProps(props) {
    this.setState({
      linkURL:          props.topicLink && props.topicLink.url || '',
      linkTitle:        props.topicLink && props.topicLink.title || '',
      reactionContent:  props.topicLink && props.topicLink.reaction.content || '',
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

  _insightChooserDialogActions = () =>
    <FlatButton label="Done" primary={ true } onTouchTap={ this._hideInsightChooser } />

  render = () =>
    <div>
      <TextField floatingLabelText="Boris said" multiLine={ true } autoFocus={ true } style={{ width: '100%' }} />
      <br />
      <TextField floatingLabelText="Link URL" value={ this.state.linkURL } onChange={ this._handleInputChange.bind(this, 'linkURL') } />
      <br />
      <TextField floatingLabelText="Link Title" value={ this.state.linkTitle } onChange={ this._handleInputChange.bind(this, 'linkTitle') } />
      <List>
        { this.state.linkInsightsIDs.map(this._renderInsight) }
      </List>
      <FlatButton label="Add an insight" primary={ true } onClick={ this._showInsightChooser } />

      <Dialog
        autoDetectWindowHeight  = { false }
        actions                 = { this._insightChooserDialogActions() }
        open                    = { this.state.isInsightChooserOpen }
        onRequestClose          = { this._hideInsightChooser }
        modal                   = { true }
      >
        <InsightChooser
          insights          = { this.props.topic.insights.edges.map(edge => edge.node) }
          selectedInsights  = { this.state.linkInsightsIDs }
          onSelect          = { this._handleInsightSelect }
        />
      </Dialog>
    </div>


  _renderInsight = (id) =>
    <ListItem key={ id }>
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
