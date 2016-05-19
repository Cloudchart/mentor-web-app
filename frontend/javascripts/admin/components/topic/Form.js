import React from 'react'
import Relay from 'react-relay'
import Environment from 'admin/Environment'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import { indigo50 } from 'material-ui/styles/colors'


class TopicForm extends React.Component {

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.setStateFromProps(props)
  }

  setStateFromProps = (props) => {

  }

  render = () => {
    return (
      <Dialog
        title           = { this.props.topic ? "Update topic" : "Create topic" }
        actions         = { this.renderActions() }
        open            = { this.props.open }
        onRequestClose  = { this.props.onCancel }
      />
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
      disabled    = { true }
      primary
    />
  ]

}


export default Relay.createContainer(TopicForm, {

  fragments: {
    topic: () => Relay.QL`
      fragment on Topic {
        id
        name
        description
      }
    `,

    admin: () => Relay.QL`
      fragment on Admin {
        id
      }
    `
  }

})
