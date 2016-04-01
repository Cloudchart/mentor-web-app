import React from 'react'


class Navigator extends React.Component {

  static propTypes = {
    initialRoute: React.PropTypes.object.isRequired,
    renderScene:  React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      stack: [this.props.initialRoute]
    }

    this._navigator = {
      pop: this._pop.bind(this),
      push: this._push.bind(this),
      reset: this._reset.bind(this),
    }
  }

  render() {
    return (
      <div className="navigator">
        { this.props.renderScene(this.state.stack[this.state.stack.length - 1], this._navigator) }
      </div>
    )
  }

  _pop() {
    this.setState({ stack: this.state.stack.slice(0, -1) })
  }

  _push(route) {
    this.setState({ stack: this.state.stack.concat(route) })
  }

  _reset() {
    this.setState({ stack: this.state.stack.slice(0, 1) })
  }

}


export default Navigator
