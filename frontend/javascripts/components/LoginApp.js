import React from 'react'

export default class extends React.Component {

  render() {
    return (
      <div>
        <h2>Login</h2>
        { this.renderLoginControl('Facebook') }
        { this.renderLoginControl('Twitter') }
      </div>
    )
  }


  renderLoginControl(provider) {
    return (
      <div style={{ margin: '10px 0' }}>
        Login with&nbsp;
        <a href={ `/auth/${provider.toLowerCase()}` }>
          { provider }
        </a>
      </div>
    )
  }

}
