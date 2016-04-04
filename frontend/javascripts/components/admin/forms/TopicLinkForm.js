import React from 'react'
import Relay from 'react-relay'

import {
  Dialog,
  FlatButton,
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
      linkURL:    props.topic && props.topic.url || '',
      linkTitle:  props.topic && props.topic.title || ''
    })
  }

  _handleInputChange(field, event) {
    let nextState = {}
    nextState[field] = event.target.value
    this.setState(nextState)
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

  render = () =>
    <div>
      <TextField floatingLabelText="Boris said" multiLine={ true } autoFocus={ true } style={{ width: '100%' }} />
      <br />
      <TextField floatingLabelText="Link URL" value={ this.state.linkURL } onChange={ this._handleInputChange.bind(this, 'linkURL') } />
      <TextField floatingLabelText="Link Title" value={ this.state.linkTitle } onChange={ this._handleInputChange.bind(this, 'linkTitle') } style={{ marginLeft: 24 }} />
      <br />
      <FlatButton label="Add an insight" primary={ true } onClick={ this._showInsightChooser } />

      <Dialog
        open            = { this.state.isInsightChooserOpen }
        onRequestClose  = { this._hideInsightChooser }
      >
        <InsightChooser insights={ this.props.topic.insights.edges.map(edge => edge.node) } />
      </Dialog>
    </div>

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
          mood
          content
        }
        insights(first: 10) {
          edges {
            node {
              id
              content
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
