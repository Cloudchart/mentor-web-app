import React from 'react'
import Relay from 'react-relay'

import ContentAddIcon from 'material-ui/svg-icons/content/add'
import CircularProgress from 'material-ui/CircularProgress'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import LazyChecker from 'admin-components/shared/Lazy'

import InsightItem from './insight/Item'
import InsightForm from './insight/Form'
import InsightList from './insight/List'


const PageSize = 20

class Insights extends React.Component {


  constructor(props, context) {
    super(props)

    this.state = {
      loadingNextPage: false,
    }
  }


  handleBottomReach = () => {
    if (this.props.admin.insights.pageInfo.hasNextPage && !this.state.loadingNextPage)
      this.loadNextPage()
  }


  handleNewInsightFormRequest = () =>
    this.setState({ renderFormForInsight: 'new' })


  hideInsightForm = () =>
    this.setState({ renderFormForInsight: null })


  loadNextPage = () => {
    this.setState({ loadingNextPage: true })
    this.props.relay.setVariables({
      first: this.props.relay.variables.first + PageSize
    }, this.doneLoadingNextPage)
  }


  doneLoadingNextPage = () =>
    this.setState({ loadingNextPage: false })


  performSearch = () => {
    this.props.relay.setVariables({ query: this.props.query })
  }


  componentWillReceiveProps = (nextProps) => {
    if (this.props.query === nextProps.query) return
    clearTimeout(this._performSearchTimeout)
    this._performSearchTimeout = setTimeout(this.performSearch, 500)
  }


  render = () => {
    let nodes = this.props.admin.insights.edges.map(({ node }) => node)

    return (
      <div style={ Styles.container }>

        <InsightList
          style = { Styles.insightsList }
          admin = { this.props.admin }
          items = { nodes }
        />

        <FloatingActionButton
          style       = { Styles.addInsightButton }
          onTouchTap  = { this.handleNewInsightFormRequest }
          secondary
        >
          <ContentAddIcon />
        </FloatingActionButton>

        <LazyChecker onEnter={ this.handleBottomReach }/>

        { this.renderProgress() }

        { this.renderFormForInsight() }
      </div>
    )
  }

  renderProgress = () =>
    this.state.loadingNextPage
      ? <CircularProgress style={ Styles.progress } />
      : null


  renderFormForInsight = () => {
    if (!this.state.renderFormForInsight) return
    return <InsightForm
      insight   = { null }
      open      = { true }
      admin     = { this.props.admin }
      onDone    = { this.hideInsightForm }
      onCancel  = { this.hideInsightForm }
    />
  }

}


const Styles = {
  container: {
  },

  insightsList: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },

  addInsightButton: {
    position: 'fixed',
    right: 20,
    bottom: 20,
  },

  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  }
}


let InsightsContainer = Relay.createContainer(Insights, {

  initialVariables: {
    first: PageSize,
    query: '',
  },

  fragments: {

    admin: () => Relay.QL`
      fragment on Admin {
        ${ InsightItem.getFragment('admin') }
        ${ InsightForm.getFragment('admin') }
        insights(first: $first, find: $query) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              ${ InsightItem.getFragment('insight') }
              ${ InsightForm.getFragment('insight') }
              id
              content
            }
          }
        }
      }
    `

  }

})


export default InsightsContainer
