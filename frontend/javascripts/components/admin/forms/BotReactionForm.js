import React from 'react'
import Relay from 'react-relay'

import {
  AutoComplete,
  Dialog,
  FlatButton,
  MenuItem,
  SelectField,
  TextField,
} from 'material-ui'


const Moods = [
  'positive',
  'negative'
]

const MoodChooser = ({ value, onChange }) =>
  <SelectField
    floatingLabelText = "Boris' mood"
    value             = { value }
    onChange          = { onChange }
  >
    {
      Moods.map(mood =>
        <MenuItem
          key         = { mood }
          value       = { mood }
          primaryText = { mood.slice(0, 1).toUpperCase() + mood.slice(1) }
        />
      )
    }
  </SelectField>


const ScopeChooser = ({ dataSource, searchText, onUpdateInput }) =>
  <AutoComplete
    floatingLabelText = "Scope"
    dataSource        = { dataSource }
    searchText        = { searchText }
    onUpdateInput     = { onUpdateInput }
  />


const ContentField = ({ value, onChange }) =>
  <TextField
    floatingLabelText = "Boris says"
    value             = { value }
    onChange          = { onChange }
    fullWidth         = { true }
    multiLine         = { true }
  />

const WeightField = ({ value, onChange }) =>
  <TextField
    floatingLabelText = "Weight"
    value             = { value }
    onChange          = { onChange }
  />


class BotReactionForm extends React.Component {

  constructor(props) {
    super(props)

    this._mood = this.props.reaction && this.props.reaction.mood || Moods[0]
    this._scope = this.props.reaction && this.props.reaction.scope || ''
    this._content = this.props.reaction && this.props.reaction.content || ''
    this._weight = this.props.reaction && this.props.reaction.weight || ''

    this.state = {
      mood:     this._mood,
      scope:    this._scope,
      content:  this._content,
      weight:   this._weight,
    }

    this._handleMoodChange = this._handleSelectFieldChange.bind(this, 'mood')
    this._handleContentChange = this._handleTextFieldChange.bind(this, 'content')
    this._handleWeightChange = this._handleTextFieldChange.bind(this, 'weight')
  }

  // Actions
  //

  onRequestSave = () => {
    console.log(this.state)
  }

  _handleSelectFieldChange = (fieldName, event, index, value) => {
    let nextState = {}
    nextState[fieldName] = value
    this.setState(nextState)
  }

  _handleTextFieldChange = (fieldName, event, value) => {
    let nextState = {}
    nextState[fieldName] = value
    this.setState(nextState)
  }

  _handleScopeChange = (value) => {
    this.setState({
      scope: value
    })
  }

  _isValid = () =>
    this.state.content.trim().length > 0 &&
    this.state.scope.trim().length > 0 &&
    parseInt(this.state.weight, 10)

  // Render
  //

  renderActions() {
    return [
      <FlatButton secondary label="Cancel" onTouchTap={ this.props.onCancel } />,
      <FlatButton primary disabled={ !this._isValid() } label="Create" onTouchTap={ this.onRequestSave } />,
    ]
  }

  render() {
    return (
      <Dialog
        actions         = { this.renderActions() }
        open            = { true }
        onRequestClose  = { this.props.onCancel }
      >
        <MoodChooser value={ this.state.mood } onChange={ this._handleMoodChange } />
        <br />
        <ScopeChooser dataSource={ this.props.scopes } searchText={ this.state.scope } onUpdateInput={ this._handleScopeChange } />
        <ContentField value={ this.state.content } onChange={ this._handleContentChange } />
        <WeightField value={ this.state.weight } onChange={ this._handleWeightChange } />
      </Dialog>
    )
  }

}


export default Relay.createContainer(BotReactionForm, {

  fragments: {
    reaction: () => Relay.QL`
      fragment on BotReaction {
        id
        scope
        mood
        content
      }
    `
  }

})
