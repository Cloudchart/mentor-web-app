import React from 'react'

import ContentAddIcon from 'material-ui/svg-icons/content/add'
import CircularProgress from 'material-ui/CircularProgress'
import FloatingActionButton from 'material-ui/FloatingActionButton'


const Styles = {
  button: {
    position: 'fixed',
    right: 20,
    bottom: 20,
  },
}

export default function({ onRequest }) {
  return (
    <FloatingActionButton
      style       = { Styles.button }
      onTouchTap  = { onRequest }
      secondary
    >
      <ContentAddIcon />
    </FloatingActionButton>
  )
}
