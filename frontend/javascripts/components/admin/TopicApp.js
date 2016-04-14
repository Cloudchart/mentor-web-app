import React from 'react'
import Relay, {
  RootContainer
} from 'react-relay'

import {
  Card,
  CardTitle,
  CardActions,
  FlatButton,
  FloatingActionButton,
  RefreshIndicator,
  Tab,
  Tabs,
} from 'material-ui'

import Refresh from 'material-ui/lib/svg-icons/navigation/refresh'

import RefreshTopicMutation from 'mutations/RefreshTopic'

import TopicLinksCard from './TopicLinksCard'
import TopicInsightsTable from './TopicInsightsTable'


class TopicApp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      shouldRenderInsights: false
    }
  }


  _handleReloadRequest = () => {
    if (this.state.reloading)
      return

    this.setState({ reloading: true })

    let mutation = new RefreshTopicMutation({ topic: this.props.node })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => { this.setState({ reloading: false }) },
      onFailure: () => { this.setState({ reloading: false }) },
    })
  }


  render() {
    return (
      <div>
        <Tabs>
          <Tab label="Links">
            <TopicLinksCard topic={ this.props.node } />
          </Tab>
          <Tab label="Insights" onActive={ () => this.setState({ shouldRenderInsights: true }) }>
            { this._renderTopicInsights() }
            { this._renderRefreshIndicator() }
          </Tab>
        </Tabs>
      </div>
    )
  }

  _renderTopicInsights() {
    return this.state.shouldRenderInsights
      ? <TopicInsightsTable topic={ this.props.node } />
      : null
  }

  _renderRefreshIndicator = () =>
    <div style = {{ position: 'fixed', right: 20, bottom: 20, width: 40, height: 40 }}>
      {
        this.state.reloading
          ? <RefreshIndicator
              percentage  = { 50 }
              status      = "loading"
              size        = { 40 }
              left        = { 0 }
              top         = { 0 }
              style       = {{ position: 'relative' }}
            />
          : <FloatingActionButton
              onTouchTap  = { this._handleReloadRequest }
              secondary
              mini
            >
              <Refresh />
            </FloatingActionButton>
      }
    </div>

}


export default Relay.createContainer(TopicApp, {

  fragments: {
    node: () => Relay.QL`
      fragment on Topic {
        id
        name
        ${ RefreshTopicMutation.getFragment('topic') }
        ${ TopicLinksCard.getFragment('topic') }
        ${ TopicInsightsTable.getFragment('topic') }
      }
    `
  }

})
