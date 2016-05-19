import React from 'react'
import Relay from 'react-relay'
import Environment from 'admin/Environment'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import { indigo50 } from 'material-ui/styles/colors'

import {
  CreateTopicMutation,
  UpdateTopicMutation,
} from 'admin/mutations'


const KnownFields = ['name', 'description']

class TopicForm extends React.Component {

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    this.setStateFromProps(props)
  }


  componentWillReceiveProps = (nextProps) =>
    this.setStateFromProps(nextProps)


  setStateFromProps = (props) => {
    let state = KnownFields
      .reduce((memo, name) => {
        memo[name] = memo.initialFields[name] || (memo.initialFields[name] = '')
        return memo
      }, { initialFields: { ...props.topic } })

    this.state ? this.setState(state) : this.state = state
  }


  changedFields = () =>
    KnownFields
      .filter(name => this.state.initialFields[name] !== this.state[name] )


  handleCommit = async () => {
    let mutationProps = {
      ...this.state,
      topic: this.props.topic,
      admin: this.props.admin,
    }
    let mutation = this.props.topic
      ? new UpdateTopicMutation(mutationProps)
      : new CreateTopicMutation(mutationProps)

    try {
      await new Promise((done, fail) => {
        Environment.commitUpdate(mutation, {
          onSuccess: done,
          onFailure: fail
        })
      })

      this.props.onDone && this.props.onDone()
    } catch (error) {
      console.error(error)
    }
  }


  handleFieldChange = (name) =>
    (event, value) =>
      this.setState({ [name]: value})


  render = () => {
    let children = [
      this.renderNameField(),
      this.renderDescriptionField()
    ]

    return (
      <Dialog
        title           = { this.props.topic ? "Update topic" : "Create topic" }
        actions         = { this.renderActions() }
        open            = { this.props.open }
        onRequestClose  = { this.props.onCancel }
      >
      { children }
    </Dialog>
    )
  }

  renderActions = () => [
    <FlatButton
      label       = "Cancel"
      onTouchTap  = { this.props.onCancel }
      secondary
    />
    ,
    <FlatButton
      label       = "Save"
      onTouchTap  = { this.handleCommit }
      disabled    = { this.changedFields().length === 0 }
      primary
    />
  ]

  renderNameField = () =>
    <TextField
      key               = "name"
      name              = "name"
      floatingLabelText = "Name"
      onChange          = { this.handleFieldChange('name') }
      value             = { this.state.name }
      autoFocus
    />


  renderDescriptionField = () =>
    <TextField
      key               = "description"
      name              = "description"
      floatingLabelText = "Description"
      onChange          = { this.handleFieldChange('description') }
      value             = { this.state.description }
      fullWidth
      multiLine
    />

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
    `,

    admin: () => Relay.QL`
      fragment on Admin {
        ${ CreateTopicMutation.getFragment('admin') }
        ${ UpdateTopicMutation.getFragment('admin') }
        id
      }
    `
  }

})
