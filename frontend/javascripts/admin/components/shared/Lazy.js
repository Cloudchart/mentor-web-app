import React from 'react'
import ReactDOM from 'react-dom'

export default class extends React.Component {


  constructor(props, context) {
    super(props, context)

    this.state = {
      isInViewPort: false
    }
  }


  isInViewPort = () => {
    let node = ReactDOM.findDOMNode(this)
    let rect = node.getBoundingClientRect()
    let bounds = {
      top: 0,
      left: 0,
      right: document.documentElement.clientWidth,
      bottom: document.documentElement.clientHeight,
    }
    let hVisible = rect.top >= bounds.top && rect.bottom <= bounds.bottom
    let tVisible = rect.top >= bounds.top && rect.top <= bounds.bottom
    let bVisible = rect.bottom >= bounds.top && rect.bottom <= bounds.bottom
    let vVisible = rect.left >= bounds.left && rect.right <= bounds.right
    let lVisible = rect.left >= bounds.left && rect.left <= bounds.right
    let rVisible = rect.right >= bounds.right && rect.right <= bounds.right

    return (hVisible && vVisible) || ((tVisible || bVisible) && (lVisible || rVisible))
  }


  handle = () => {
    if (this.state.isInViewPort === this.isInViewPort()) return
    (
      this.state.isInViewPort
        ? this.props.onLeave && this.props.onLeave()
        : this.props.onEnter && this.props.onEnter()
    )
    this.setState({ isInViewPort: !this.state.isInViewPort })
  }


  start = () => {
    window.addEventListener('scroll', this.handle)
    this.handle()
  }


  stop = () => {
    window.removeEventListener('scroll', this.handle)
  }


  componentDidMount = () => {
    this.start()
    this.isInViewPort()
  }

  componentWillUnmount = () => {
    this.stop()
  }


  render = () => {
    return <div />
  }

}
