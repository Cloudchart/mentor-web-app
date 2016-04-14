import React from 'react'
import Relay from 'react-relay'

import {
  Dialog,
  FlatButton,
  IconButton,
  ListItem,
} from 'material-ui'

import Close from 'material-ui/lib/svg-icons/navigation/close'

import AnswerForm from './forms/AnswerForm'

import RemoveAnswerMutation from '../../mutations/RemoveAnswer'


const RemoveButton = (props) =>
  <IconButton { ...props }>
    <Close color="red" />
  </IconButton>


class AnswerItem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      shouldRenderForm: false,
      shouldRenderDialog: false,
    }
  }

  _showForm = () =>
    this.setState({ shouldRenderForm: true })

  _hideForm = () =>
    this.setState({ shouldRenderForm: false })

  _showDialog = () =>
    this.setState({ shouldRenderDialog: true })

  _hideDialog = () =>
    this.setState({ shouldRenderDialog: false })

  _handleRemoveRequest = () => {
    let mutation = new RemoveAnswerMutation({
      answerID:   this.props.answer.id,
      questionID: this.props.questionID
    })
    Relay.Store.commitUpdate(mutation, {
      onFailure: (transaction) => alert(transaction.getError())
    })
  }

  render = () =>
    <div>
      <ListItem
        key                 = { this.props.answer.id }
        onTouchTap          = { this._showForm }
        rightIconButton     = { <RemoveButton onTouchTap={ this._showDialog } /> }
        secondaryText       = { this.props.answer.reaction && this.props.answer.reaction.content }
      >
        { this.props.answer.content }
      </ListItem>
      { this.state.shouldRenderForm ? this._renderForm() : null }
      { this._renderDialog() }
    </div>

  _renderForm = () =>
    <AnswerForm
      questionID  = { this.props.questionID }
      answer      = { this.props.answer }
      onCancel    = { this._hideForm }
      onDone      = { this._hideForm }
    />

  _renderDialog = () =>
    <Dialog
      title           = "Confirmation request"
      open            = { this.state.shouldRenderDialog }
      actions         = { this._renderDialogActions() }
      onRequestClose  = { this._hideDialog }
    >
      Are you sure you want to remove this answer?
    </Dialog>

  _renderDialogActions = () => [
    <FlatButton label="Cancel" secondary onTouchTap={ this._hideDialog } />,
    <FlatButton label="Remove" primary onTouchTap={ this._handleRemoveRequest } />
  ]

}

export default Relay.createContainer(AnswerItem, {

  fragments: {
    answer: () => Relay.QL`
      fragment on Answer {
        ${ AnswerForm.getFragment('answer') }
        id
        content
        reaction {
          content
        }
      }
    `
  }

})
