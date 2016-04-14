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
  Paper,
  Subheader,
  TextField,
} from 'material-ui'

import {
  red500,
  indigo500,
  grey500,
} from 'material-ui/lib/styles/colors'

import AnswerItem from './AnswerItem'
import AnswerForm from './forms/AnswerForm'
import QuestionForm from './forms/QuestionForm'

const Severity = ['Low', 'Normal', 'High']
const SeverityColors = [grey500, indigo500, red500]


class QuestionApp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      answer: undefined,
      shouldRenderQuestionForm: false
    }
  }

  _showQuestionForm = () =>
    this.setState({ shouldRenderQuestionForm: true })

  _hideQuestionForm = () =>
    this.setState({ shouldRenderQuestionForm: false })

  render = () =>
    <Card style={{ margin: 20 }}>
      <CardTitle
        title       = { this.props.question.content }
        subtitle    = { this.props.question.reaction && this.props.question.reaction.content }
      />
      <Divider />
      <CardText>
        asd;l
      </CardText>
      { this._renderQuestionForm() }
    </Card>

  __render = () => {
    <Card style={{ margin: 20 }}>
      <CardTitle style={{ backgroundColor: '#eee' }} title={ this.props.question.content } />
      <CardText>
        { this._renderQuestion() }
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
  }

  _renderQuestion = () =>
    <ListItem
      secondaryText = { this.props.question.reaction && this.props.question.reaction.content }
      onTouchTap    = { this._showQuestionForm }
    >
      { this.props.question.content }
      <br />
      { this._renderQuestionSeverity() }
    </ListItem>

  _renderQuestionSeverity = () =>
    <span
      style = {{ ...Style.questionSeverity, color: SeverityColors[this.props.question.severity + 1] }}
    >
      { Severity[this.props.question.severity + 1] }
    </span>

  _renderQuestionForm = () =>
    this.state.shouldRenderQuestionForm
      ?
        <QuestionForm
          question  = { this.props.question }
          onCancel  = { this._hideQuestionForm }
          onDone    = { this._hideQuestionForm }
        />
      : null

  _renderAnswers = () =>
    this.props.question.answers.edges.length > 0
      ? <List>
          <Subheader>Answers</Subheader>
          { this.props.question.answers.edges.map((edge, ii) => this._renderAnswer(edge.node, ii)) }
        </List>
      : <div>No answers</div>

  _renderAnswer = (answer, ii) => [
    ii == 0 ? null : <Divider />,
    <AnswerItem
      key         = { answer.id }
      answer      = { answer }
      questionID  = { this.props.question.id }
      onSelect    = { () => this.setState({ answer }) }
    />,
  ]

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


const Style = {
  questionSeverity: {
    fontSize: '.75em',
    fontWeight: 'bold'
  }
}


export default Relay.createContainer(QuestionApp, {

  fragments: {

    question: () => Relay.QL`
      fragment on Question {
        ${ QuestionForm.getFragment('question') }
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
