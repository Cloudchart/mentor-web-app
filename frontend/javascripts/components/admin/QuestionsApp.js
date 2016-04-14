import React from 'react'
import Relay from 'react-relay'

import {
  Dialog,
  FlatButton,
  FloatingActionButton,
  IconButton,
  Snackbar,
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody,
  TableRow,
  TableRowColumn,
  TableFooter,
  Toggle,
} from 'material-ui'

import Close from 'material-ui/lib/svg-icons/navigation/close'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'

import QuestionForm from './forms/QuestionForm'

import RemoveQuestionMutation from 'mutations/RemoveQuestion'
import UpdateQuestionPublishedStatus from 'mutations/UpdateQuestionPublishedStatus'

import QuestionApp from './QuestionApp'


const RemoveQuestionButton = ({ callback }) =>
  <IconButton onTouchTap={ () => { if (confirm('Are you sure?')) callback() } }>
    <Close color="red" />
  </IconButton>


class QuestionsApp extends React.Component {


  constructor(props) {
    super(props)

    this.state = {
      questionsIDsInTransition: [],
      questionID: null,
      shouldRenderQuestionForm: false,
    }
  }


  _showQuestionForm = () =>
    this.setState({ shouldRenderQuestionForm: true })

  _hideQuestionForm = () =>
    this.setState({ shouldRenderQuestionForm: false })


  _handleRemoveQuestionRequest = (question) => {
    let mutation = new RemoveQuestionMutation({
      questionID: question.id,
      adminID:    this.props.admin.id,
    })

    Relay.Store.commitUpdate(mutation, {
      onFailure: (transaction) => {
        alert(transaction.getError())
      }
    })
  }


  _handlePublishedStatusToggle = (event, status, questionID) => {
    if (this.state.questionsIDsInTransition.indexOf(questionID) !== -1) return

    let mutation = new UpdateQuestionPublishedStatus({ status, questionID })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: (response) => {
        this._clearQuestionFromTransitions(questionID)
      },
      onFailure: (transaction) => {
        this._clearQuestionFromTransitions(questionID)
        this.setState({
          failure: transaction.getError().source.errors[0].message
        })
      }
    })
  }

  _clearQuestionFromTransitions = (questionID) => {
    let ids = this.state.questionsIDsInTransition
    let ii = ids.indexOf(questionID)
    if (ii !== -1)
      this.setState({
        questionsIDsInTransition: ids.slice(0, ii).concat(ids.slice(ii + 1))
      })
  }

  render = () =>
    this.state.questionID && this.state.questionID !== 'new'
      ? <QuestionApp
          question  = { this.props.admin.questions.edges.find(edge => edge.node.id === this.state.questionID ).node }
          onCancel  = { () => this.setState({ questionID: null }) }
          onDone    = { () => this.setState({ questionID: null }) }
        />
      : this._renderList()

  _renderList = () =>
    <div style={{ margin: 20 }}>
      <Table selectable={ false }>
        <TableHeader adjustForCheckbox={ false } displaySelectAll={ false }>
          <TableRow>
            <TableHeaderColumn>Content</TableHeaderColumn>
            <TableHeaderColumn>Answers</TableHeaderColumn>
            <TableHeaderColumn>Published</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={ false }>
          { this.props.admin.questions.edges.map(edge => this._renderQuestion(edge.node)) }
        </TableBody>
      </Table>
      <FlatButton label="Add a question" secondary={ true } onTouchTap={ () => this.setState({ questionID: 'new' }) } />
      { this._renderQuestionForm() }
      { this._renderNewQuestionButton() }
    </div>


  _renderNewQuestionButton = () =>
    <FloatingActionButton
      style       = {{ position: 'fixed', right: 20, bottom: 20 }}
      onTouchTap  = { this._showQuestionForm }
      secondary
    >
      <ContentAdd />
    </FloatingActionButton>

  _renderQuestionForm = () =>
    this.state.shouldRenderQuestionForm
      ? <QuestionForm
          admin     = { this.props.admin }
          question  = { null }
          onDone    = { this._hideQuestionForm }
          onCancel  = { this._hideQuestionForm }
        />
      : null


  _renderQuestion = (question) => {
    return (
      <TableRow key={ question.id }>
        <TableRowColumn>
          <a href="#" onClick={ event =>  { event.preventDefault() ; this.setState({ questionID: question.id }) } }>
            { question.content }
          </a>
        </TableRowColumn>
        <TableRowColumn>
          { question.answers.count }
        </TableRowColumn>
        <TableRowColumn>
          <Toggle
            toggled   = { question.isPublished }
            onToggle  = { (event, status) => this._handlePublishedStatusToggle(event, status, question.id) }
            disabled  = { question.answers.count == 0 }
          />
        </TableRowColumn>
        <TableRowColumn style={{ textAlign: 'right' }}>
          <RemoveQuestionButton callback={ () => this._handleRemoveQuestionRequest(question) } />
        </TableRowColumn>
      </TableRow>
    )
  }

}


export default Relay.createContainer(QuestionsApp, {

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        ${ QuestionForm.getFragment('admin') }
        questions(first: 100) {
          edges {
            node {
              ${ QuestionApp.getFragment('question') }
              id
              content
              isPublished
              answers {
                count
              }
              reaction {
                content
              }
            }
          }
        }
      }
    `
  }

})
