import React from 'react'

import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'


export default class NodeList extends React.Component {

  static propTypes = {
    nodes: React.PropTypes.array.isRequired,
    renderNode: React.PropTypes.func.isRequired,
  }

  render = () => {
    let children = this.props.nodes.reduce((memo, node, ii, nodes) => {
      if (ii > 0) memo.push(<Divider key={ ii } />)
      memo.push(this.props.renderNode(node, ii, nodes))
      return memo
    }, [])

    return (
      <Paper style={{ ...this.props.style }}>
        { children }
      </Paper>
    )
  }

}
