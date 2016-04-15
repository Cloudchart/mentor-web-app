import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import Storages, {
  BotReactionStorage,
} from '../../storage'

import BotReactionType from '../types/BotReaction'
import BotReactionOwnerInterface from '../interfaces/BotReactionOwner'


const InputFields = {

  ownerID: {
    type: GraphQLID
  },

  scope: {
    type: GraphQLString,
  },

  mood: {
    type: GraphQLString,
    defaultValue: 'positive',
  },

  content: {
    type: new GraphQLNonNull(GraphQLString)
  },

}


const OutputFields = {
  reaction: {
    type: new GraphQLNonNull(BotReactionType),
  },

  owner: {
    type: new GraphQLNonNull(BotReactionOwnerInterface),
  },
}


export const SetBotReactionToOwnerMutation = mutationWithClientMutationId({

  name: 'SetBotReactionToOwnerMutation',

  inputFields: InputFields,

  outputFields: OutputFields,

  mutateAndGetPayload: async ({ ownerID, scope, mood, content }, { rootValue: { viewer } }) => {
    let {
      id: owner_id,
      type: owner_type,
    } = fromGlobalId(ownerID)

    const Storage = Storages[owner_type + 'Storage']
    let owner = await Storage.load(owner_id)
    if (!owner)
      return new Error('Owner not found.')

    let reaction = await BotReactionStorage.loadOne('forOwner', { owner_id, owner_type }).catch(() => null)

    reaction = reaction
      ? await BotReactionStorage.update(reaction.id, { content, mood })
      : await BotReactionStorage.create({ owner_id, owner_type, content, mood })

    return { reaction, owner }
  }

})


export const AddBotReactionToOwnerMutation = mutationWithClientMutationId({

  name: 'AddBotReactionToOwnerMutation',

  inputFields: InputFields,

  outputFields: {
    ...OutputFields,

    reactionEdge: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  mutateAndGetPayload: async ({ ownerID, scope, mood, content }, { rootValue: { viewer } }) => {
    let {
      id: owner_id,
      type: owner_type
    } = fromGlobalId(ownerID)

    const Storage = Storages[owner_type + 'Storage']
    let owner = await Storage.load(owner_id)
    if (!owner)
      return new Error('Owner not found.')

    return { reaction, owner }
  }

})
