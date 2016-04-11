import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { setBotReactionToOwner }
  `

  getFatQuery = () =>
    Relay.QL`
      fragment on SetBotReactionToOwnerMutationPayload {
        owner { reaction }
      }
    `

  getVariables = () => ({
    ownerID:  this.props.ownerID,
    content:  this.props.content,
    mood:     this.props.mood,
  })

  getConfigs = () => [{
    type: 'FIELDS_CHANGE',
    fieldIDs: { owner: this.props.ownerID }
  }]

}
