import React from 'react'
import Relay from 'react-relay'

class ThemesCreator extends React.Component {


  state = {
    query: ''
  }


  _handleQueryChange = (event) => {
    this.setState({ query: event.target.value })
  }


  _filteredThemes = () =>
    this.props.viewer.themes.edges
      .filter(themeEdge => themeEdge.node.name.indexOf(this.state.query) > -1)
      .sort((a, b) => a.node.name < b.node.name ? -1 : a.node.name > b.node.name ? 1 : 0)


  render() {
    return (
      <div>
        <h2>
          Themes creator app
        </h2>
        { this.renderQuery() }
        { this.renderSystemThemes() }
        { this.renderCreateControl() }
      </div>
    )
  }


  renderQuery() {
    return (
      <input type="search" onChange={ this._handleQueryChange } value={ this.state.query } />
    )
  }


  renderSystemThemes() {
    return (
      <ul>
        { this._filteredThemes().map(this.renderSystemTheme) }
      </ul>
    )
  }


  renderSystemTheme = (themeEdge) => {
    return (
      <li key={ themeEdge.node.id }>
        { themeEdge.node.name }
      </li>
    )
  }

  renderCreateControl() {
    let value   = this.state.query.toLowerCase()
    if (value.length < 2) return null

    let values  = this.props.viewer.themes.edges.map(edge => edge.node.name)
    if (values.indexOf(value) > -1) return null

    let link = '/themes/create?name=' + value

    return (
      <p>
        <a href={ link }>
          Create theme <strong>{ this.state.query.toLowerCase() }</strong>
        </a>
      </p>
    )
  }

}

export default Relay.createContainer(ThemesCreator, {

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        themes(first: 1000) {
          edges {
            node {
              id,
              name
            }
          }
        }
      }
    `
  }

})
