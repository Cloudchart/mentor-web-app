import React from 'react'
import Relay from 'react-relay'


import {
  List,
  ListItem,
  TextField
} from 'material-ui'


class InsightChooser extends React.Component {


  constructor(props) {
    super(props)

    this.state = {
      filter: ''
    }
  }


  render = () =>
    <div style={ height: '100%' }>
      <TextField hintText="Start typing..." fullWidth={ true } autoFocus={ true } />
      <div style={{ overflowY: 'scroll' }}>
        <List>
          { this.props.insights.map(this._renderInsight) }
        </List>
      </div>
    </div>

  _renderInsight = (insight) =>
    <ListItem key={ insight.id } primaryText={ insight.content } />

}


export default InsightChooser
