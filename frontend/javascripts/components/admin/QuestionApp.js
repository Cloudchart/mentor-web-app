import React from 'react'
import Relay from 'react-relay'

import {
  Card,
  CardActions,
  CardTitle,
  CardText,
  Divider,
  FlatButton,
  IconButton,
  List,
  ListItem,
  Subheader,
  TextField,
} from 'material-ui'

import AnswerItem from './AnswerItem'
import AnswerForm from './forms/AnswerForm'

import {
  ContentField,
  SeverityField,
  BotReactionContentField
} from './forms/NewQuestionForm'


class QuestionApp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      answer:   undefined,
      content:  this.props.question.content,
      severity: this.props.question.severity,
      reactionContent: this.props.question.reaction && this.props.question.reaction.content
    }
  }

  render = () =>
    <Card style={{ margin: 20 }}>
      <CardTitle style={{ backgroundColor: '#eee' }} title={ this.props.question.content } />
      <CardText>
        <ContentField
          value     = { this.state.content }
          onChange  = { event => this.setState({ content: event.target.value }) }
        />
        <SeverityField
          value     = { this.state.severity }
          onChange  = { (event, ii, value) => this.setState({ severity: value })}
        />
        <BotReactionContentField
          value     = { this.state.reactionContent }
          onChange  = { event => this.setState({ reactionContent: event.target.value }) }
        />

        { this._renderAnswers() }
      </CardText>

      <CardActions style={{ display: 'flex' }}>
        <FlatButton label="Add an answer" secondary onTouchTap={ () => this.setState({ answer: null }) } />
        <div style={{ flex: 1 }} />
        <FlatButton label="Cancel" secondary onTouchTap={ this.props.onCancel } />
        <FlatButton label="Done" primary onTouchTap={ this.props.onDone } />
      </CardActions>

      { this._renderAnswerForm() }
    </Card>

  _renderAnswers = () =>
    this.props.question.answers.edges.length > 0
      ? <List>
          <Subheader>Answers</Subheader>
          { this.props.question.answers.edges.map(edge => this._renderAnswer(edge.node)) }
        </List>
      : <div>No answers</div>

  _renderAnswer = (answer) =>
    <AnswerItem
      key         = { answer.id }
      answer      = { answer }
      questionID  = { this.props.question.id }
      onSelect    = { () => this.setState({ answer }) }
    />

  _renderAnswerForm = () =>
    this.state.answer === undefined
      ? null
      : <AnswerForm
          questionID  = { this.props.question.id }
          answer      = { this.state.answer }
          onCancel    = { () => this.setState({ answer: undefined }) }
          onDone      = { () => this.setState({ answer: undefined }) }
        />

}


export default Relay.createContainer(QuestionApp, {

  fragments: {

    question: () => Relay.QL`
      fragment on Question {
        id
        content
        severity
        reaction {
          content
        }
        answers(first: 100) {
          edges {
            node {
              ${ AnswerItem.getFragment('answer') }
              ${ AnswerForm.getFragment('answer') }
              id
              content
            }
          }
        }
      }
    `

  }

})
