import React from 'react'
import Relay from 'react-relay'

import AdminRoute from '../../routes/admin/AdminRoute'

import TopicsApp from './TopicsApp'


const Types = {
  'topics': {
    title: 'Topics',
    Component:  TopicsApp,
    Route:      AdminRoute,
  }
}


class Chooser extends React.Component {

  render = () =>
    <ul>
      { Object.keys(Types).map(key => this._renderType(key)) }
    </ul>

  _renderType = (key) =>
    <li key={ key }>
      <a href="#" onClick={ event => this._handleTypeClick(event, key) }>
        { Types[key].title }
      </a>
    </li>

  _handleTypeClick = (event, key) => {
    event.preventDefault()
    this.props.navigator.push(Types[key])
  }

}


export default Relay.createContainer(Chooser, {

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        id
      }
    `
  }

})
