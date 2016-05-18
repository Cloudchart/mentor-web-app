import React from 'react'
import Relay from 'react-relay'
import Environment from 'admin/Environment'

import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import { indigo50 } from 'material-ui/styles/colors'

import {
  CreateInsightMutation,
  UpdateInsightMutation,
} from 'admin/mutations'


class Form extends React.Component {

  constructor(props) {
    super(props)

    this.setStateFromProps(props)
  }

  setStateFromProps = (props) => {
    let insight = { ...this.props.insight }
    let origin  = { ...insight.origin }

    this._initialState = {
      content : insight.content || '',
      author  : origin.author || '',
      url     : origin.url || '',
    }

    this.state ? this.setState({ ...this.initialState }) : this.state = { ...this._initialState }
  }


  handleValueChange = (valueName) =>
    (event, value) =>
      this.setState({ [valueName]: value })


  handleCommit = async () => {
    try {
      this.props.insight ? await this.updateInsight() : await this.createInsight()
      this.props.onDone && this.props.onDone()
    } catch (error) {
      console.error(error.getError && error.getError() || error)
    }
  }

  createInsight = () =>
    new Promise((done, fail) => {
      let mutation = new CreateInsightMutation({
        ...this.state,
        admin: this.props.admin,
      })
      Environment.commitUpdate(mutation, {
        onSuccess: done,
        onFailure: fail
      })
    })

  updateInsight = () => {
    new Promise((done, fail) => {
      let mutation = new UpdateInsightMutation({
        ...this.state,
        insight: this.props.insight,
      })
      Environment.commitUpdate(mutation, {
        onSuccess: done,
        onFailure: fail
      })
    })
  }


  hasChanges = () =>
    this.state.content !== this._initialState.content ||
    this.state.author !== this._initialState.author ||
    this.state.url !== this._initialState.url

  isValid = () =>
    this.state.content.trim().length > 0 &&
    this.state.author.trim().length > 0


  componentWillReceiveProps = (nextProps) =>
    this.setStateFromProps(nextProps)


  render() {
    return (
      <Dialog
        title           = { this.props.insight ? "Update insight" : "Create insight" }
        actions         = { this.renderActions() }
        onRequestClose  = { this.props.onCancel }
        titleStyle      = { Styles.titleStyle }
        open            = { this.props.open }
      >
        { this.renderContentField() }
        { this.renderAuthorField() }
        { this.renderURLField() }
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
      disabled    = { !this.isValid() || !this.hasChanges() }
      primary
    />
  ]

  renderContentField = () =>
    <TextField
      floatingLabelText = "Content"
      name              = "content"
      value             = { this.state.content }
      onChange          = { this.handleValueChange('content') }
      autoFocus
      multiLine
      fullWidth
    />

  renderAuthorField = () =>
    <TextField
      floatingLabelText = "Author"
      name              = "author"
      value             = { this.state.author }
      onChange          = { this.handleValueChange('author') }
    />

  renderURLField = () =>
    <TextField
      floatingLabelText = "URL"
      name              = "url"
      value             = { this.state.url }
      onChange          = { this.handleValueChange('url') }
      fullWidth
    />
}


const Styles = {
  titleStyle: {
    backgroundColor: '#3F51B5',
    color: 'white',
  }
}


export default Relay.createContainer(Form, {

  fragments: {
    insight: () => Relay.QL`
      fragment on Insight {
        ${ UpdateInsightMutation.getFragment('insight') }
        id
        content
        origin {
          url
          title
          author
          duration
        }
      }
    `,

    admin: () => Relay.QL`
      fragment on Admin {
        ${ CreateInsightMutation.getFragment('admin') }
      }
    `
  }

})
