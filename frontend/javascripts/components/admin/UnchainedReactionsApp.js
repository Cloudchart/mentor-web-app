import React from 'react'
import Relay from 'react-relay'

import {
  FloatingActionButton,
  Paper
} from 'material-ui'

import ContentAdd from 'material-ui/svg-icons/content/add'

import BotReactionForm from './forms/BotReactionForm'


class UnchainedReactionsApp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      shouldShowAddReactionForm: false
    }
  }

  // Actions
  //

  _showAddReactionForm = () =>
    this.setState({ shouldShowAddReactionForm: true })

  _hideAddReactionForm = () =>
    this.setState({ shouldShowAddReactionForm: false })

  _onRequestAddReaction = () =>
    this._showAddReactionForm()

  // Renders
  //

  renderAddReactionButton() {
    return (
      <FloatingActionButton
        onTouchTap  = { this._onRequestAddReaction }
        style       = {{ position: 'fixed', right: 20, bottom: 20 }}
        secondary
      >
        <ContentAdd />
    </FloatingActionButton>
    )
  }

  renderAddReactionForm() {
    if (!this.state.shouldShowAddReactionForm) return
    return <BotReactionForm reaction={ null } onCancel={ this._hideAddReactionForm } scopes={ [] } />
  }

  render() {
    return (
      <div>
        { this.renderAddReactionButton() }
        { this.renderAddReactionForm() }
      </div>
    )
  }

}


export default Relay.createContainer(UnchainedReactionsApp, {

  fragments: {

    admin: () => Relay.QL`
      fragment on Admin {
        reactions(first: 1000) {
          edges {
            node {
              ${ BotReactionForm.getFragment('reaction') }
              id
              mood
              content
            }
          }
        }
      }
    `

  }

})
