import React from 'react'
import Relay from 'react-relay'


import {
  Divider,
  List,
  ListItem
} from 'material-ui'


class TopicInsightsTable extends React.Component {

  constructor(props) {
    super(props)

    this._renderInsightTableRow = this._renderInsightTableRow.bind(this)
  }

  render = () =>
    <List>
      { this.props.topic.insights.edges.map(edge => this._renderInsightTableRow(edge.node) ) }
    </List>


  _renderInsightTableRow = (insight) =>
    [
      <ListItem primaryText={ insight.content } />
      ,
      <Divider />
    ]

}


export default Relay.createContainer(TopicInsightsTable, {

  initialVariables: {
    first: 1000,
  },

  fragments: {

    topic: () => Relay.QL`
      fragment on Topic {
        id
        insights(filter: ADMIN, first: $first) {
          edges {
            node {
              id
              content
            }
          }
        }
      }
    `

  }

})
