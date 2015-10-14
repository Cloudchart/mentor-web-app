import React from 'react'

export default class extends React.Component {

  handleLoginButtonClick = (provider, event) => {
    location = '/auth/' + provider
  }

  render = () =>
    <ul>
      <li>
        <button onClick={ this.handleLoginButtonClick.bind(null, 'facebook') }>
          Login with Facebook
        </button>
      </li>
      <li>
        <button onClick={ this.handleLoginButtonClick.bind(null, 'twitter') }>
          Login with Twitter
        </button>
      </li>
    </ul>

}
