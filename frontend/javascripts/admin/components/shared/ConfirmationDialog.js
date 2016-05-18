import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'


let ConfirmationDialogActions = ({ cancelLabel, confirmLabel, onCancel, onConfirm }) => [
  <FlatButton label={ cancelLabel } onTouchTap={ onCancel } secondary />
  ,
  <FlatButton label={ confirmLabel } onTouchTap={ onConfirm } primary />
]


let ConfirmationDialog = ({
  title,
  open,
  children,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}) =>
  <Dialog
    actions         = { ConfirmationDialogActions({ cancelLabel, confirmLabel, onCancel, onConfirm }) }
    title           = { title }
    open            = { open }
    onRequestClose  = { onCancel }
  >
    { children }
  </Dialog>


export default ConfirmationDialog
