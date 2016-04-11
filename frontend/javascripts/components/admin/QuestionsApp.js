import React from 'react'
import Relay from 'react-relay'

import {
  Dialog,
  FlatButton,
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

import NewQuestionForm from './forms/NewQuestionForm'

import UpdateQuestionPublishedStatus from '../../mutations/UpdateQuestionPublishedStatus'


class QuestionsApp extends React.Component {


  constructor(props) {
    super(props)

    this.state = {
      questionsIDsInTransition: [],
      questionID: null
    }
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
    <div style={{ margin: 20 }}>
      <Table selectable={ false }>
        <TableHeader adjustForCheckbox={ false } displaySelectAll={ false }>
          <TableRow>
            <TableHeaderColumn>Content</TableHeaderColumn>
            <TableHeaderColumn>Answers</TableHeaderColumn>
            <TableHeaderColumn>Published</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={ false }>
          { this.props.admin.questions.edges.map(edge => this._renderQuestion(edge.node)) }
        </TableBody>
      </Table>
      <FlatButton label="Add a question" secondary={ true } onTouchTap={ () => this.setState({ questionID: 'new' }) } />
      { this._renderNewQuestionForm() }
    </div>

  _renderQuestion = (question) => {
    return (
      <TableRow key={ question.id }>
        <TableRowColumn>
          <a href="#" onClick={ event => event.preventDefault() }>
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
      </TableRow>
    )
  }

  _renderNewQuestionForm = () => {
    if (this.state.questionID !== 'new') return null
    return (
      <NewQuestionForm
        adminID       = { this.props.admin.id }
        onDone        = { () => this.setState({ questionID: null }) }
        onCancel      = { () => this.setState({ questionID: null }) }
      />
    )
  }

}


export default Relay.createContainer(QuestionsApp, {

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        id
        questions(first: 100) {
          edges {
            node {
              id
              content
              isPublished
              answers {
                count
              }
            }
          }
        }
      }
    `
  }

})
