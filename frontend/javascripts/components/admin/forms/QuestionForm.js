import React from 'react'
import Relay from 'react-relay'

import {
  Dialog,
  FlatButton,
  MenuItem,
  Paper,
  SelectField,
  Snackbar,
  TextField,
} from 'material-ui'

import CreateQuestionMutation from 'mutations/CreateQuestion'
import UpdateQuestionMutation from 'mutations/UpdateQuestion'
import SetBotReactionToOwnerMutation from 'mutations/SetBotReactionToOwner'

const Actions = ({ onCancel, onDone, isChanged, isValid }) =>
  <div>
    <FlatButton label="Cancel" secondary onTouchTap={ onCancel } />
    <FlatButton label={ isChanged ? 'Save' : 'Done' } primary disabled={ !isValid } onTouchTap={ onDone } />
  </div>


const ContentField = ({ value, onChange }) =>
  <TextField
    floatingLabelText = "Question"
    autoFocus         = { true }
    fullWidth         = { true }
    multiLine         = { true }
    value             = { value }
    onChange          = { onChange }
  />

export const SeverityField = ({ value, onChange }) =>
  <SelectField
    floatingLabelText = "Severity"
    value             = { value }
    onChange          = { onChange }
  >
    <MenuItem value={ -1 } primaryText="Low" />
    <MenuItem value={  0 } primaryText="Normal" />
    <MenuItem value={  1 } primaryText="High" />
  </SelectField>

const ReactionContentField = ({ value, onChange }) =>
  <TextField
    floatingLabelText = "Boris will say"
    fullWidth         = { true }
    multiLine         = { true }
    value             = { value }
    onChange          = { onChange }
  />

class QuestionForm extends React.Component {

  static propTypes = {
    onDone:   React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)

    this._content = this.props.question && this.props.question.content || ''
    this._severity = this.props.question && this.props.question.severity || 0
    this._reactionContent = this.props.question && this.props.question.reaction && this.props.question.reaction.content || ''

    this.state = {
      content:          this._content,
      severity:         this._severity,
      reactionContent:  this._reactionContent,
    }

    this._handleContentChange = this._handleTextFieldChange.bind(this, 'content')
    this._handleSeverityChange = this._handleSelectChange.bind(this, 'severity')
    this._handleReactionContentChange = this._handleTextFieldChange.bind(this, 'reactionContent')
  }

  _submit = () =>
    this.props.question
      ? this._update()
      : this._create()


  _create = () => {
    if (!this._isValid())
      return

    let mutation = new CreateQuestionMutation({
      admin:    this.props.admin,
      severity: this.state.severity,
      content:  this.state.content,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this._commitReaction,
      onFailure: this._handleError,
    })
  }

  _update = () => {
    if (!this._isValid())
      return

    if (!this._isQuestionChanged())
      return this._commitReaction()

    let mutation = new UpdateQuestionMutation({
      question: this.props.question,
      severity: this.state.severity,
      content:  this.state.content,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this._commitReaction,
      onFailure: this._handleError,
    })
  }

  _commitReaction = (createResponse) => {
    if (!this._isReactionChanged())
      return this.props.onDone()

    let ownerID = this.props.question ? this.props.question.id : createResponse.createQuestion.questionEdge.node.id

    let mutation = new SetBotReactionToOwnerMutation({
      content: this.state.reactionContent,
      ownerID,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.props.onDone,
      onFailure: this._handleError,
    })
  }

  _handleError = (transaction) =>
    null

  _showError = (errorMessage) =>
    this.setState({ errorMessage })

  _hideError = () =>
    this.setState({ errorMessage: false })


  _handleTextFieldChange = (field, { target: { value } }) => {
    let nextState = {}
    nextState[field] = value
    this.setState(nextState)
  }

  _handleSelectChange = (field, event, index, value) => {
    let nextState = {}
    nextState[field] = value
    this.setState(nextState)
  }

  _isValid = () =>
    this.state.content.trim().length !== 0

  _isChanged = () =>
    this._isQuestionChanged() || this._isReactionChanged()

  _isQuestionChanged = () =>
    this._content !== this.state.content ||
    this._severity !== this.state.severity

  _isReactionChanged = () =>
    this._reactionContent !== this.state.reactionContent

  render = () =>
    <Paper>
      <Dialog
        open            = { true }
        title           = { this.props.question ? "Update a question" : "Create a question" }
        actions         = { this._renderActions() }
        onRequestClose  = { this.props.onCancel }
      >
        <ContentField value={ this.state.content } onChange={ this._handleContentChange } />
        <SeverityField value={ this.state.severity} onChange={ this._handleSeverityChange } />
        <ReactionContentField value={ this.state.reactionContent } onChange={ this._handleReactionContentChange } />
      </Dialog>

      { this._renderSnackBar() }
    </Paper>

  _renderActions = () =>
    <Actions
      onDone    = { this._submit }
      onCancel  = { this.props.onCancel }
      isChanged = { this._isChanged() }
      isValid   = { this._isValid() }
    />

  _renderSnackBar = () =>
    <Snackbar
      action            = "OK"
      message           = { this.state.errorMessage || '' }
      open              = { !!this.state.errorMessage }
      onRequestClose    = { this._hideError }
      onActionTouchTap  = { this._hideError }
    />

}


export default Relay.createContainer(QuestionForm, {

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        ${ CreateQuestionMutation.getFragment('admin') }
      }
    `,

    question: () => Relay.QL`
      fragment on Question {
        ${ UpdateQuestionMutation.getFragment('question') }
        id
        content
        severity
        reaction {
          content
        }
      }
    `
  }

})
