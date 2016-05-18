import React from 'react'

import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'
import { ListItem } from 'material-ui/List'

import Item from './Item'


let List = ({ style, admin, items }) => {

  let children = items.reduce((memo, item, ii) => {
    if (ii > 0) memo.push( <Divider key={ ii } /> )
    memo.push( <Item admin={ admin } insight={ item } key={ item.id } /> )
    return memo
  }, [])

  return (
    <Paper style={{ ...style }}>
      { children }
    </Paper>
  )
}

export default List
