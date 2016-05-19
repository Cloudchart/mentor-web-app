import React from 'react'
import Relay from 'react-relay'

import Environment from 'admin/Environment'
import {
  DeleteTopicMutation
} from 'admin/mutations'

import NodeList from './shared/NodeList'
import ConfirmationDialog from './shared/ConfirmationDialog'
import FloatingCreateButton from './shared/FloatingCreateButton'

import TopicItem from './topic/Item'
import TopicForm from './topic/Form'


const PageSize = 20
const NoTopicForForm = 'NO TOPIC FOR FORM'
const SearchTimeout = 300


let printTransactionErrors = (errors) =>
  [].concat(errors).forEach(({ message }) => console.error(message))


let handleTransactionError = (transaction) => {
  let errors = transaction.getError()
  typeof errors.json === 'function'
    ? errors.json().then(({ errors }) => printTransactionErrors(errors))
    : printTransactionErrors(errors)
}


class Topics extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      topic: null,
      showTopicForm: false,
      showConfirmationDialog: false,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.query !== this.props.query)
      this.performSearch(nextProps.query)
  }

  performSearch = (query) => {
    clearTimeout(this._performSearchTimeout)
    this._performSearchTimeout = setTimeout(() => {
      this.props.relay.setVariables({ q: query })
    }, SearchTimeout)
  }


  deleteTopic = () => {
    let mutation = new DeleteTopicMutation({
      topic: this.state.topic,
      admin: this.props.admin,
    })

    Environment.commitUpdate(mutation, {
      onSuccess: (response) => {
        this.hideConfirmationDialog()
      },
      onFailure: handleTransactionError,
    })
  }


  findTopicById = (id) => {
    let topicEdge = this.props.admin.topics.edges.find(({ node }) => node.id === id)
    return topicEdge && topicEdge.node || null
  }


  showTopicForm = (id) =>
    this.setState({ showTopicForm: true, topic: this.findTopicById(id) })

  hideTopicForm = (id) =>
    this.setState({ showTopicForm: false, topic: null })

  handleTopicUpdateRequest = (id) =>
    this.showTopicForm(id)


  showConfirmationDialog = (id) =>
    this.setState({ showConfirmationDialog: true, topic: this.findTopicById(id) })

  hideConfirmationDialog = () =>
    this.setState({ showConfirmationDialog: false, topic: null })

  handleTopicDeleteRequest = (id) =>
    this.showConfirmationDialog(id)


  handleListBottom = () => {
    if (this.props.admin.topics.pageInfo.hasNextPage)
      this.props.relay.setVariables({ first: this.props.relay.variables.first + PageSize })
  }


  findTopicForForm = () => {
    let edge = this.props.admin.topics.edges.find(({ node }) => node.id === this.state.showTopicForm)
    return edge && edge.node || NoTopicForForm
  }


  render = () => {

    return (
      <div style={ Styles.container }>
        <NodeList
          nodes           = { this.props.admin.topics.edges.map(({ node }) => node ) }
          renderNode      = { this.renderNode }
          onBottomReached = { this.handleListBottom }
        />

        <TopicForm
          open      = { this.state.showTopicForm }
          topic     = { this.state.topic }
          admin     = { this.props.admin }
          onDone    = { this.hideTopicForm }
          onCancel  = { this.hideTopicForm }
        />

        <FloatingCreateButton
          onRequest = { () => this.showTopicForm('new') }
        />

        <ConfirmationDialog
          open          = { this.state.showConfirmationDialog }
          onCancel      = { this.hideConfirmationDialog }
          onConfirm     = { this.deleteTopic }
          title         = "Are you sure?"
          cancelLabel   = "Cancel"
          confirmLabel  = "Delete"
        />
      </div>
    )
  }

  renderNode = (topic) =>
    <TopicItem
      key             = { topic.id }
      topic           = { topic }
      admin           = { this.props.admin }
      onUpdateRequest = { this.handleTopicUpdateRequest }
      onDeleteRequest = { this.handleTopicDeleteRequest }
    />

}


const Styles = {

  container: {

  }

}


export default Relay.createContainer(Topics, {

  initialVariables: {
    first: PageSize,
    q: '',
  },

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        ${ TopicForm.getFragment('admin') }
        ${ DeleteTopicMutation.getFragment('admin') }
        id
        topics(first: $first, find: $q) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              ${ TopicItem.getFragment('topic') }
              ${ TopicForm.getFragment('topic') }
              ${ DeleteTopicMutation.getFragment('topic') }
              id
            }
          }
        }
      }
    `
  }

})
