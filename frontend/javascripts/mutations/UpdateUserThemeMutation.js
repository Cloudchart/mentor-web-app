import Relay from 'react-relay'


let baseRangeAddConfig = (parentID, rangeBehaviors) => ({
  type:             'RANGE_ADD',
  parentName:       'user',
  parentID:         parentID,
  connectionName:   'themes',
  edgeName:         'userThemeEdge',
  rangeBehaviors:   rangeBehaviors
})


export default class extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User { id }
    `
    ,
    userTheme: () => Relay.QL`
      fragment on UserTheme { id }
    `
  }

  getMutation = () => Relay.QL`
    mutation { updateUserTheme }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on UpdateUserThemePayload {
        userTheme
        userThemeEdge
        user {
          themes {
            subscribedCount
          }
        }
      }
    `

  getVariables = () => ({
    id:       this.props.userTheme.id,
    status:   this.props.status
  })

  getConfigs = () => {
    let configs = [{
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          userTheme:  this.props.userTheme.id
        }
    }]

    if (this.props.status === 'SUBSCRIBED') {
      configs.push(Object.assign(baseRangeAddConfig(this.props.user.id, {
        'filter(RELATED)':    'append',
        'filter(UNRELATED)':  'remove'
      })))
    }

    if (this.props.status === 'REJECTED') {
      configs.push(Object.assign(baseRangeAddConfig(this.props.user.id, {
        'filter(RELATED)':    'remove',
        'filter(UNRELATED)':  'append'
      })))
    }

    if (this.props.status === 'VISIBLE') {
      configs.push(Object.assign(baseRangeAddConfig(this.props.user.id, {
        'filter(RELATED)':    'append',
        'filter(UNRELATED)':  'remove'
      })))
    }
    return configs
  }

}
