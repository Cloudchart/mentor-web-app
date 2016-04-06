import React from 'react'
import Relay from 'react-relay'


import {
  Dialog,
  FlatButton,
  IconButton,
  List,
  ListItem,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  SvgIcon,
} from 'material-ui'

import {
  blueGrey500
} from 'material-ui/lib/styles/colors'

import EditMode from 'material-ui/lib/svg-icons/editor/mode-edit'

import RolesForm from './forms/RolesForm'


const UsersPerPage = 10


class UsersApp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      shouldShowRolesDialog: false,
      currentUser: null,
    }
  }

  _showRolesDialog = (user) =>
    this.setState({
      currentUser: user,
      shouldShowRolesDialog: true,
    })

  _hideRolesDialog = () =>
    this.setState({
      currentUser: null,
      shouldShowRolesDialog: false
    })

  render = () =>
    <div>
      <Table selectable={ false }>
        <TableHeader adjustForCheckbox={ false } displaySelectAll={ false }>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Roles</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={ false }>
          { this.props.admin.users.edges.map((edge, ii) => this._renderUser(edge.node, ii)) }
        </TableBody>
      </Table>
      { this._renderRolesDialog() }
    </div>

  _renderUser = (user, ii) =>
    <TableRow key={ user.id }>
      <TableRowColumn>
        { user.name }
      </TableRowColumn>
      <TableRowColumn style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onTouchTap={ () => this._showRolesDialog(user) }>
          <EditMode color={ blueGrey500 }/>
        </IconButton>
        { user.roles.edges.map(edge => edge.node.name).map(name => name[0].toUpperCase() + name.slice(1)).join(', ') }
      </TableRowColumn>
    </TableRow>

  _renderRolesDialog = () =>
    this.state.shouldShowRolesDialog && this.state.currentUser &&
    <Dialog
      open            = { this.state.shouldShowRolesDialog }
      onRequestClose  = { this._hideRolesDialog }
      title           = { `Roles for ${this.state.currentUser.name}` }
      actions         = { <FlatButton label="Done" primary onTouchTap={ this._hideRolesDialog } /> }
    >
      <RolesForm user={ this.state.currentUser } />
    </Dialog>

}


export default Relay.createContainer(UsersApp, {

  initialVariables: {
    usersCount: UsersPerPage
  },

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        users(first: $usersCount) {
          edges {
            node {
              ${RolesForm.getFragment('user')}
              id
              name
              roles(first: 100) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `
  }

})
