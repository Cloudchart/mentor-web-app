import React from 'react'
import Relay from 'react-relay'

import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui'

import IntroduceAnswerMutation from '../../../mutations/IntroduceAnswer'
import UpdateAnswerMutation from '../../../mutations/UpdateAnswer'

export const ContentField = (props) =>
  <TextField
    floatingLabelText = "Answer"
    autoFocus         = { true }
    fullWidth         = { true }
    multiLine         = { true }
    { ...props }
  />

export const BotReactionContentField = (props) =>
  <TextField
    floatingLabelText = "Boris will say"
    fullWidth         = { true }
    multiLine         = { true }
    { ...props }
  />

class AnswerForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      content: props.answer && props.answer.content || '',
      reactionContent: props.answer && props.answer.reaction && props.answer.reaction.content || ''
    }
  }

  _handleSave = () => {
    if (!this._isValid()) return
    this.props.answer
      ? this._update()
      : this._create()
  }

  _create = () => {
    let mutation = new IntroduceAnswerMutation({ questionID: this.props.questionID, content: this.state.content })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this._setBotReaction,
      onFailure: (transaction) => alert(transaction.getError())
    })
  }

  _update = () => {
    let mutation = new UpdateAnswerMutation({ answerID: this.props.answer.id, content: this.state.content })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: this._setBotReaction,
      onFailure: (transaction) => alert(transaction.getError())
    })
  }

  _setBotReaction = () => {
    let prevReactionContent = this.props.answer && this.props.answer.reaction && this.props.answer.reaction.content
    this.props.onDone()
  }

  _isValid = () =>
    this.state.content.trim().length > 0

  render = () =>
    <Dialog
      actions         = { this._renderActions() }
      title           = { this.props.answer ? "Update an answer" : "Add an answer" }
      open            = { true }
      onRequestClose  = { this.props.onCancel }
    >
      <ContentField
        value     = { this.state.content }
        onChange  = { event => this.setState({ content: event.target.value }) }
      />
      <BotReactionContentField
        value     = { this.state.reactionContent }
        onChange  = { event => this.setState({ reactionContent: event.target.value }) }
      />
    </Dialog>

  _renderActions = () => [
    <FlatButton label="Cancel" secondary onTouchTap={ this.props.onCancel } />,
    <FlatButton
      label       = "Save"
      disabled    = { !this._isValid() }
      onTouchTap  = { () => this._handleSave() }
      primary
    />
  ]

}


export default Relay.createContainer(AnswerForm, {

  fragments: {
    answer: () => Relay.QL`
      fragment on Answer {
        id
        content
        position
        reaction {
          content
        }
      }
    `
  }

})
