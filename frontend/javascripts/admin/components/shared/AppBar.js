import React from 'react'
import Relay from 'react-relay'

import Paper from 'material-ui/Paper'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import IconButton from 'material-ui/IconButton'


const Styles = {

  container: {
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    display: 'flex',
    paddingLeft: 0,
    paddingRight: 20,
    position: 'fixed',
    height: 64,
    top: 0,
    right: 0,
    left: 0
  },

  titleContainer: {
    alignItems: 'center',
    display: 'flex',
    paddingLeft: 10,
    position: 'relative',
    width: 270,
  },

  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20,
    fontWeight: 300,
  }

}

export default class extends React.Component {

  render = () =>
    <div style={ Styles.container }>
      <div style={ Styles.titleContainer }>
        <IconButton onTouchTap={ this.props.onRequestMenu }>
          <MenuIcon color="white" />
        </IconButton>
        <Paper style={ Styles.title } zDepth={ 0 } >
          { this.props.title }
        </Paper>
      </div>
      { this.props.children }
    </div>

}
