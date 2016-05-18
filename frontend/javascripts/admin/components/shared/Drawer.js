import React from 'react'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'


const Styles = {
  container: {
    top: 64,
  }
}


export default function({ open, items, onChange }) {
  let children = items.map(({ value, title }) =>
    <MenuItem
      key         = { value }
      primaryText = { title }
      onTouchTap  = { () => onChange && onChange(value) }
    />
  )

  return (
    <Drawer
      open            = { open }
      children        = { children }
      containerStyle  = { Styles.container }
      width           = { 250 }
    />
  )
}
