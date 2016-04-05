import React from 'react'
import Relay from 'react-relay'


import {
  List,
  ListItem,
  TextField
} from 'material-ui'


class InsightChooser extends React.Component {


  constructor(props) {
    super(props)

    this.state = {
      filter:           '',
      dataSource:       [],
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filter !== this.state.filter || this.props.selectedInsights !== prevProps.selectedInsights) {
      clearTimeout(this._filterInsightTimeout)
      this._filterInsightTimeout = setTimeout(this._filterInsights)
    }
  }

  componentWillMount() {
    this._filterInsights()
  }

  _filterInsights = () => {
    let filter = this.state.filter.toLowerCase()
    this.setState({
      dataSource: this.props.insights.filter(insight => this.props.selectedInsights.indexOf(insight.id) == -1 && insight.content.toLowerCase().indexOf(filter) >= 0)
    })
  }


  _handleFilterChange = (event) => {
    this.setState({
      filter: event.target.value
    })
  }

  render = () =>
    <div>
      <TextField
        hintText  = "Start typing..."
        fullWidth = { true }
        value     = { this.state.filter }
        onChange  = { this._handleFilterChange }
        autoFocus = { true }
      />
      <List style={{ height: 400, overflowY: 'scroll' }}>
        { this.state.dataSource.map(this._renderInsight) }
      </List>
    </div>

  _renderInsight = (insight) =>
    <ListItem key={ insight.id } onTouchTap={ () => this.props.onSelect && this.props.onSelect(insight.id) }>
      { insight.content }
    </ListItem>

}


export default InsightChooser
