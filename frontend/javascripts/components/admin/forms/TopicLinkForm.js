import React from 'react'
import Relay from 'react-relay'


import IntroduceLinkToTopicMutation from '../../../mutations/admin/IntroduceLinkToTopic'
import InsightChooser from './InsightChooser'
import NodeRoute from '../../../routes/NodeRoute'


class InsightComponent extends React.Component {
  render() {
    return (
      <div className="topic-link-form-insight">
        { this.props.node.content }
        <a className="remove" href="#" onClick={ (event) => { event.preventDefault() ; this.props.onSelect && this.props.onSelect(this.props.node.id) } }>-</a>
      </div>
    )
  }
}

let RelayInsightComponent = Relay.createContainer(InsightComponent, {
  fragments: {
    node: () => Relay.QL`
      fragment on Insight {
        id
        content
      }
    `
  }
})


class TopicLinkForm extends React.Component {


  constructor(props, context) {
    super(props, context)

    this.state = {
      linkID:           this.props.linkID,
      url:              this.props.url || '',
      title:            this.props.title || '',
      insightIDs:       this.props.insightIDs || [],
      reactionContent:  this.props.reactionContent || '',
    }

    this._handleInsightSelect = this._handleInsightSelect.bind(this)
    this._handleRemoveInsight = this._handleRemoveInsight.bind(this)
  }


  render() {
    return(
      <form onSubmit={ this._handleSubmit.bind(this) }>
        <div>Boris said</div>
        <div>
          <textarea
            placeholder = "Always tell your mommy before you go somewhere"
            autoFocus   = { true }
            value       = { this.state.reactionContent }
            onChange    = { this._handleInputChange.bind(this, 'reactionContent') }
          />
        </div>
        <div>Where do we go?</div>
        <div>
          <input
            type        = "text"
            placeholder = "URL"
            value       = { this.state.url }
            onChange    = { this._handleInputChange.bind(this, 'url') }
          />
        </div>
        <div>
          <input
            type        = "text"
            placeholder = "Title"
            value       = { this.state.title }
            onChange    = { this._handleInputChange.bind(this, 'title') }
          />
        </div>
        <div>And there should be insights:</div>
        { this._renderInsights() }
        <Relay.RootContainer
          Component={ InsightChooser }
          route={
            new NodeRoute({
              id: this.props.topicID,
              onSelect: this._handleInsightSelect,
              filterIDs: this.state.insightIDs,
            })
          }
          />
        <div>
          <button type="submit" disabled={ this._validate() }>Save</button>
          <button type="button" onClick={ this.props.onCancel }>Cancel</button>
        </div>
      </form>
    )
  }

  _renderInsights() {
    if (this.state.insightIDs.length == 0) return
    return (
      <ul className="topic-link-form-insights-container">
        { this.state.insightIDs.map((id) => this._renderInsight(id)) }
      </ul>
    )
  }

  _renderInsight(id) {
    return <Relay.RootContainer
      key={ id }
      Component={ RelayInsightComponent }
      route={
        new NodeRoute({ id, onSelect: this._handleRemoveInsight })
      }
    />
  }

  _validate() {
    return this.state.url.trim().length == 0
      || this.state.title.trim().length == 0
      || this.state.insightIDs.length == 0
  }

  _handleSubmit(event) {
    event.preventDefault()
    this.props.linkID
      ? this._updateLink()
      : this._createLink()
  }

  _handleInsightSelect(id) {
    if (this.state.insightIDs.indexOf(id) >= 0) return
    this.setState({
      insightIDs: this.state.insightIDs.concat(id)
    })
  }

  _handleRemoveInsight(id) {
    let index = this.state.insightIDs.indexOf(id)
    if (index == -1) return
    let ids = [].concat(this.state.insightIDs)
    ids.splice(index, 1)
    this.setState({
      insightIDs: ids
    })
  }

  _createLink() {
    Relay.Store.update(new IntroduceLinkToTopicMutation({
      topicID:          this.props.topicID,
      linkURL:          this.state.url,
      linkTitle:        this.state.title,
      linkInsightsIDs:  this.state.insightIDs,
    }), {
      onSuccess: () => this.props.onDone && this.props.onDone(),
      onFailure: () => alert('Shit happens :)')
    })
  }

  _updateLink() {
    alert('Not implemented.')
  }

  _handleInputChange(name, event) {
    let nextState = { ...this.state }
    nextState[name] = event.target.value
    this.setState(nextState)
  }

}


export default TopicLinkForm
