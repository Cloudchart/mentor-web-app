import React from 'react'
import Relay from 'react-relay'

import {
  Checkbox,
  List,
  ListItem,
  Snackbar,
} from 'material-ui'

import GrantRoleToUserMutation from '../../../mutations/GrantRoleToUser'
import RevokeRoleFromUserMutation from '../../../mutations/RevokeRoleFromUser'

const AvailableRoles = [
  'admin',
  'editor'
]


class RolesForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      error: null
    }
  }

  _hasRole = (role) =>
    !!this.props.user.roles.edges.find(edge => edge.node.name == role)

  _handleRoleCheck = (role) =>
    this._hasRole(role)
      ? this._revokeRole(role)
      : this._grantRole(role)

  _grantRole = (role) =>
    Relay.Store.commitUpdate(new GrantRoleToUserMutation({
      userID:   this.props.user.id,
      roleName: role,
    }), {
      onSuccess: this._handleSuccess,
      onFailure: this._handleFailure,
    })

  _revokeRole = (role) =>
    Relay.Store.commitUpdate(new RevokeRoleFromUserMutation({
      userID:   this.props.user.id,
      roleName: role,
    }), {
      onSuccess: this._handleSuccess,
      onFailure: this._handleFailure,
    })

  _handleSuccess = (response) =>
    null

  _handleFailure = (transaction) =>
    this.setState({
      error: transaction.getError().source.errors[0].message
    })

  render = () =>
    <List>
      { AvailableRoles.map(this._renderRole) }
      <Snackbar
        autoHideDuration  = { 3000 }
        message           = { this.state.error || '' }
        open              = { !!this.state.error }
        onRequestClose    = { () => this.setState({ error: null }) }
      />
    </List>

  _renderRole = (role) =>
    <ListItem key={ role } leftCheckbox={ <Checkbox checked={ this._hasRole(role) } onCheck={ () => this._handleRoleCheck(role) } /> }>
      { role[0].toUpperCase() + role.slice(1) }
    </ListItem>

}


export default Relay.createContainer(RolesForm, {

  initialVariables: {
    rolesToFetch: 10
  },

  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        roles(first: $rolesToFetch) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `
  }

})
