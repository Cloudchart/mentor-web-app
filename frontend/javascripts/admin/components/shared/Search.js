import React from 'react'

import Paper from 'material-ui/Paper'
import SearchIcon from 'material-ui/svg-icons/action/search'


const Styles = {
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .15)',
    borderRadius: 2,
    display: 'flex',
    flex: 1,
    height: 40,
  },

  icon: {
    marginLeft: 20,
    marginRight: 20,
  },

  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    flex: 1,
    fontSize: 16,
    fontWeight: 400,
    outline: 'none',
  }
}


export default function({ query, onChange }) {
  return (
    <Paper style={ Styles.container } zDepth={ 0 }>
      <SearchIcon style={ Styles.icon } color="white" />
      <input
        type        = "text"
        className   = 'white-placeholder'
        placeholder = "Search"
        value       = { query }
        onChange    = { (event) => onChange && onChange(event.target.value) }
        style       = { Styles.input }
      />
    </Paper>
  )
}
