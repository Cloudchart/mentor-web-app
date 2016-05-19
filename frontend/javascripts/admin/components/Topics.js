import React from 'react'
import Relay from 'react-relay'

import NodeList from 'admin/components/shared/NodeList'
import FloatingCreateButton from 'admin/components/shared/FloatingCreateButton'
import TopicItem from './topic/Item'
import TopicForm from './topic/Form'

const PageSize = 20
const NoTopicForForm = 'NO TOPIC FOR FORM'

class Topics extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showTopicForm: false
    }
  }


  showTopicForm = (id) =>
    this.setState({ showTopicForm: id })

  hideTopicForm = (id) =>
    this.setState({ showTopicForm: null })

  handleTopicRequest = (id) =>
    this.showTopicForm(id)

  handleListBottom = () => {
    if (this.props.admin.topics.pageInfo.hasNextPage)
      this.props.relay.setVariables({ first: this.props.relay.variables.first + PageSize })
  }


  findTopicForForm = () => {
    let edge = this.state.admin.topics.edges.find(({ node }) => node.id === this.state.showTopicForm)
    return edge && edge.node || NoTopicForForm
  }


  render = () => {

    let topicForForm = this.state.showTopicForm
      ? this.state.showTopicForm === 'new' ? null : this.findTopicForForm()
      : NoTopicForForm

    return (
      <div style={ Styles.container }>
        <NodeList
          nodes           = { this.props.admin.topics.edges.map(({ node }) => node ) }
          renderNode      = { this.renderNode }
          onBottomReached = { this.handleListBottom }
        />

        <TopicForm
          open      = { !!this.state.showTopicForm && topicForForm !== NoTopicForForm }
          topic     = { topicForForm === NoTopicForForm ? null : topicForForm }
          admin     = { this.props.admin }
          onDone    = { this.hideTopicForm }
          onCancel  = { this.hideTopicForm }
        />

        <FloatingCreateButton
          onRequest = { () => this.showTopicForm('new') }
        />
      </div>
    )
  }

  renderNode = (topic) =>
    <TopicItem
      key       = { topic.id }
      topic     = { topic }
      admin     = { this.props.admin }
      onRequest = { this.handleTopicRequest }
    />

}


const Styles = {

  container: {

  }

}


export default Relay.createContainer(Topics, {

  initialVariables: {
    first: PageSize
  },

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        ${ TopicForm.getFragment('admin') }
        topics(first: $first) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              ${ TopicItem.getFragment('topic') }
              ${ TopicForm.getFragment('topic') }
              id
            }
          }
        }
      }
    `
  }

})
