import React from 'react'
import Relay from 'react-relay'


const InitialPageSize = 1000


class InsightChooser extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      filter: '',
      filterIDs: this.props.filterIDs || []
    }

    this._handleFilterChange = this._handleFilterChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filterIDs: nextProps.filterIDs || this.state.filterIDs
    })
  }

  render() {
    return (
      <div className="insights-chooser-container">
        { this._renderFilter() }
        <ul ref="list" className="insights-chooser-list" onScroll={ this._handleListScroll }>
          { this._filterInsights().map(edge => this._renderInsight(edge.node)) }
        </ul>
      </div>
    )
  }

  _renderFilter() {
    return (
      <input
        type        = "text"
        placeholder = "Type something"
        className   = "insights-chooser-filter"
        value       = { this.state.filter }
        onChange    = { this._handleFilterChange }
      />
    )
  }

  _renderInsight(node) {
    return (
      <li key={ node.id } className="insights-chooser-item" onClick={ this._handleListItemClick.bind(this, node.id) }>
        { node.content }
      </li>
    )
  }

  _handleFilterChange(event) {
    this.setState({ filter: event.target.value })
  }

  _handleListItemClick(id, event) {
    this.props.onSelect && this.props.onSelect(id)
  }

  _filterInsights() {
    if (this._prevFilter !== this.state.filter || this.state.filterIDs) {
      let filter = this.state.filter.toLowerCase()
      this._filteredInsights = this.props.node.insights.edges.filter(edge => this.props.filterIDs.indexOf(edge.node.id) == -1 && edge.node.content.toLowerCase().indexOf(filter) >= 0)
    }
    this._prevFilter = this.state.filter
    return this._filteredInsights
  }

}


export default Relay.createContainer(InsightChooser, {

  initialVariables: {
    first: InitialPageSize,
  },

  fragments: {

    node: () => Relay.QL`
      fragment on Topic {
        id
        insights(filter: ADMIN, first: $first) {
          pageInfo {
            hasNextPage
          }
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
