import React from 'react'
import Relay from 'react-relay'


import {
  Dialog,
  FlatButton,
  TextField,
} from 'material-ui'

import UpdateTopicMutation from 'mutations/UpdateTopic'


const NameField = ({ value, onChange }) =>
  <TextField
    floatingLabelText = "Name"
    value     = { value }
    onChange  = { onChange }
  />

const DescriptionField = ({ value, onChange }) =>
  <TextField
    floatingLabelText = "Description"
    value             = { value }
    onChange          = { onChange }
    multiLine         = { true }
    fullWidth         = { true }
  />


class TopicForm extends React.Component {

  constructor(props) {
    super(props)

    this._name = this.props.topic && this.props.topic.name || ''
    this._description = this.props.topic && this.props.topic.description || ''

    this.state = {
      name:         this._name,
      description:  this._description,
      inTransition: false,
    }

    this._handleNameChange = this._handleFieldChange.bind(this, 'name')
    this._handleDescriptionChange = this._handleFieldChange.bind(this, 'description')
  }


  _handleRequestSave = () => {
    if (!this._isValid()) return
    if (this.state.inTransition) return
    this.setState({ inTransition: true })

    this.props.topic
      ? this._update()
      : this._create()
  }

  _create = () => {
    alert('Not implemented.')
  }

  _update = () => {
    let mutation = new UpdateTopicMutation({
      topic:        this.props.topic,
      name:         this.state.name,
      description:  this.state.description,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.props.onDone,
      onFailure: (transaction) => {
        this.setState({ inTransition: false })
        alert(transaction.getError())
      }
    })
  }

  _handleFieldChange = (name, event, value) => {
    let nextState = {}
    nextState[name] = value
    this.setState(nextState)
  }

  _isValid = () =>
    this.state.name.trim().length > 0

  _renderActions() {
    return [
      <FlatButton secondary label="Cancel" onTouchTap={ this.props.onCancel } />
      ,
      <FlatButton primary label="Save" onTouchTap={ this._handleRequestSave } disabled={ !this._isValid() } />
    ]
  }

  render() {
    return (
      <Dialog
        open            = { true }
        actions         = { this._renderActions() }
        onRequestClose  = { this.props.onCancel }
      >
        <NameField value={ this.state.name } onChange={ this._handleNameChange } />
        <DescriptionField value={ this.state.description } onChange={ this._handleDescriptionChange } />
      </Dialog>
    )
  }

}


export default Relay.createContainer(TopicForm, {

  fragments: {
    topic: () => Relay.QL`
      fragment on Topic {
        ${ UpdateTopicMutation.getFragment('topic') }
        id
        name
        description
      }
    `
  }

})
