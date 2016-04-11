import React from 'react'
import Relay from 'react-relay'

import {
  Card,
  CardText,
  Dialog,
  FlatButton,
  MenuItem,
  SelectField,
  TextField,
} from 'material-ui'


import CreateQuestionMutation from '../../../mutations/CreateQuestion'

const ContentField = ({ value, onChange }) =>
  <TextField
    floatingLabelText = "Question"
    value             = { value }
    autoFocus         = { true }
    fullWidth         = { true }
    multiLine         = { true }
    onChange          = { onChange }
  />

const BotReactionContentField = ({ value, onChange }) =>
  <TextField
    floatingLabelText = "Boris will say"
    value             = { value }
    fullWidth         = { true }
    multiLine         = { true }
    onChange          = { onChange }
  />

const SeverityField = ({ value, onChange }) =>
  <SelectField
    floatingLabelText = "Severity"
    value             = { value }
    onChange          = { onChange }
  >
    <MenuItem value={ "-1" } primaryText="Low" />
    <MenuItem value={  "0" } primaryText="Normal" />
    <MenuItem value={  "1" } primaryText="High" />
  </SelectField>


class NewQuestionForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      content:            '',
      severity:           "0",
      botReactionContent: ''
    }

    this._handleContentChange = this._handleInputChange.bind(this, 'content')
    this._handleBotReactionContentChange = this._handleInputChange.bind(this, 'botReactionContent')
  }

  _handleInputChange = (field, event) => {
    let newFieldState = {}
    newFieldState[field] = event.target.value
    this.setState(newFieldState)
  }

  _handleSeverityChange = (event, index, value) =>
    this.setState({ severity: value })

  _isValid = () =>
    this.state.content.trim().length > 0

  _handleCreate = () => {
    if (!this._isValid()) return

    let mutation = new CreateQuestionMutation({
      adminID:  this.props.adminID,
      content:  this.state.content,
      severity: this.state.severity,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this._addBotReaction,
      onFailure: (transaction) => {
        alert(transaction.getError())
      }
    })
  }

  _addBotReaction = () => {
    if (!this.state.botReactionContent) return this.props.onDone()

  }


  render = () =>
    <Dialog
      title           = "Add new question"
      open            = { true }
      actions         = { this._renderActions() }
      onRequestClose  = { this.props.onCancel }
    >
      <ContentField value={ this.state.content } onChange={ this._handleContentChange } />
      <SeverityField value={ this.state.severity } onChange={ this._handleSeverityChange } />
      <BotReactionContentField value={ this.state.botReactionContent } onChange={ this._handleBotReactionContentChange } />
    </Dialog>


  _renderActions = () => [
    <FlatButton label="Cancel" secondary onTouchTap={ this.props.onCancel } />,
    <FlatButton label="Create" primary disabled={ !this._isValid() } onTouchTap={ this._handleCreate } />,
  ]

}


export default NewQuestionForm
