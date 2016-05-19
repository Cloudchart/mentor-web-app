import React from 'react'

import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

const MenuButton =
  <IconButton>
    <MoreVertIcon />
  </IconButton>


const ItemMenu = ({ onUpdateRequest, onDeleteRequest }) => {

  return (
    <div>
      <IconMenu iconButtonElement = { MenuButton }>
        <MenuItem onTouchTap={ onUpdateRequest }>Update</MenuItem>
        <MenuItem onTouchTap={ onDeleteRequest }>Delete</MenuItem>
      </IconMenu>
    </div>
  )
}

export default ItemMenu
