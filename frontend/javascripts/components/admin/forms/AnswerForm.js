import React from 'react'
import Relay from 'react-relay'

import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui'

import IntroduceAnswerMutation from '../../../mutations/IntroduceAnswer'
import UpdateAnswerMutation from '../../../mutations/UpdateAnswer'
import SetBotReactionToOwnerMutation from '../../../mutations/SetBotReactionToOwner'

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

    this._content = props.answer && props.answer.content || ''
    this._reactionContent = props.answer && props.answer.reaction && props.answer.reaction.content || ''

    this.state = {
      content: this._content,
      reactionContent: this._reactionContent,
    }
  }

  _handleSave = () => {
    if (!this._isValid()) return
    if (!this._isChanged()) return this.props.onDone()
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
    if (this._isAnswerChanged()) {
      let mutation = new UpdateAnswerMutation({ answerID: this.props.answer.id, content: this.state.content })
      Relay.Store.commitUpdate(mutation, {
        onSuccess: this._setBotReaction,
        onFailure: (transaction) => alert(transaction.getError())
      })
    } else {
      this._setBotReaction({})
    }
  }

  _setBotReaction = (response) => {
    if (this._isReactionChanged()) {
      let answerID = this.props.answer ? this.props.answer.id : response.introduceAnswer.answerEdge.node.id
      let mutation = new SetBotReactionToOwnerMutation({ ownerID: answerID, content: this.state.reactionContent })
      Relay.Store.commitUpdate(mutation, {
        onSuccess: this.props.onDone,
        onFailure: (transaction) => alert(transaction.getError())
      })
    } else {
      this.props.onDone()
    }
  }

  _isValid = () =>
    this.state.content.trim().length > 0

  _isChanged = () =>
    this._isAnswerChanged() || this._isReactionChanged()

  _isAnswerChanged = () =>
    this._content !== this.state.content

  _isReactionChanged = () =>
    this._reactionContent !== this.state.reactionContent

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
      label       = { !this.props.answer || this._isChanged() ? 'Save' : 'Done' }
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
