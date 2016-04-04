import React from 'react'
import Relay, {
  RootContainer
} from 'react-relay'

import {
  Card,
  CardTitle,
  CardActions,
  FlatButton,
  Tab,
  Tabs,
} from 'material-ui'


import TopicLinksCard from './TopicLinksCard'
import TopicInsightsTable from './TopicInsightsTable'


class TopicApp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      shouldRenderInsights: false
    }
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

}


export default Relay.createContainer(TopicApp, {

  fragments: {
    node: () => Relay.QL`
      fragment on Topic {
        id
        name
        ${TopicLinksCard.getFragment('topic')}
        ${TopicInsightsTable.getFragment('topic')}
      }
    `
  }

})
