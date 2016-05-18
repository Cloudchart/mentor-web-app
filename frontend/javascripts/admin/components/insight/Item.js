import React from 'react'
import Relay from 'react-relay'
import moment from 'moment'

import { ListItem } from 'material-ui/List'

import Environment from 'admin/Environment'

import {
  DeleteInsightMutation
} from 'admin/mutations'

import ItemMenu from './ItemMenu'
import Form from './Form'
import ConfirmationDialog from 'admin/components/shared/ConfirmationDialog'


let commitDelete = (props) => {
  new Promise((done, fail) => {
    let mutation = new DeleteInsightMutation(props)
    Environment.commitUpdate(mutation, {
      onSuccess: done,
      onFailure: fail
    })
  })
}


let resolveOrigin = ({ author, title, url, duration }) => {
  duration = duration && moment.duration(duration, 'seconds').humanize() + ' read'
  return [author, title, duration]
    .filter(part => !!part)
    .filter((part, ii, parts) => parts.indexOf(part) === ii)
    .join(', ')
}


class Item extends React.Component {

  constructor(props) {
    super(props)

    this.menu = ItemMenu({
      onRequestUpdate: this.onRequestUpdate,
      onRequestDelete: this.onRequestDelete
    })

    this.state = {
      showConfirmationDialog: false,
      showForm: false,
    }
  }


  commitDelete = async () => {
    await commitDelete(this.props)
  }


  onRequestUpdate = () =>
    this.showForm()

  showForm = () =>
    this.setState({ showForm: true })

  hideForm = () =>
    this.setState({ showForm: false })


  onRequestDelete = () =>
    this.showConfirmationDialog()

  showConfirmationDialog = () =>
    this.setState({ showConfirmationDialog: true })

  hideConfirmationDialog = () =>
    this.setState({ showConfirmationDialog: false })


  render = () =>
    <ListItem
      key               = { this.props.insight.id }
      secondaryText     = { resolveOrigin({ ...this.props.insight.origin }) }
      rightIconButton   = { this.menu }
    >
      <div style={ Styles.contentStyle }>
        { this.props.insight.content }
      </div>
      <Form
        open      = { this.state.showForm }
        admin     = { null }
        insight   = { this.props.insight }
        onCancel  = { this.hideForm }
        onDone    = { this.hideForm }
      />
      <ConfirmationDialog
        title         = "Are you sure?"
        cancelLabel   = "Cancel"
        confirmLabel  = "Delete"
        open          = { this.state.showConfirmationDialog }
        onCancel      = { this.hideConfirmationDialog }
        onConfirm     = { this.commitDelete }
      />
    </ListItem>

}


const Styles = {

  contentStyle: {
    fontSize: 14,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }

}


export default Relay.createContainer(Item, {

  fragments: {
    admin: () => Relay.QL`
      fragment on Admin {
        ${ DeleteInsightMutation.getFragment('admin') }
        ${ Form.getFragment('admin') }
      }
    `
    ,
    insight: () => Relay.QL`
      fragment on Insight {
        ${ DeleteInsightMutation.getFragment('insight') }
        ${ Form.getFragment('insight') }
        id
        content
        origin {
          url
          title
          author
          duration
        }
      }
    `
  }

})
