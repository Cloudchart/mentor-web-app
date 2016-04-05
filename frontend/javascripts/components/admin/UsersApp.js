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

import RolesForm from './forms/RolesForm'


const ZoomIn = (props) =>
  <SvgIcon { ...props }>
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
  </SvgIcon>

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
        { user.roles.edges.map(edge => edge.node.name).map(name => name[0].toUpperCase() + name.slice(1)).join(',') }
        <IconButton onTouchTap={ () => this._showRolesDialog(user) }>
          <ZoomIn color={ blueGrey500 }/>
        </IconButton>
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
