import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLInterfaceType
} from 'graphql'


import {
  BotReactionStorage
} from '../../storage'


export const Resolve = async (owner) => {
  let { id: owner_id, __type: owner_type } = owner
  return await BotReactionStorage.loadOne('forOwner', { owner_id, owner_type })
}

export const ResolveWithScope = async (owner, scope) => {
  let { id: owner_id, __type: owner_type } = owner
  return await BotReactionStorage.loadOne('forOwnerWithScope', { owner_id, owner_type, scope })
}


export default new GraphQLInterfaceType({
  name: 'BotReactionOwner',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    reaction: {
      type: BotReactionType,
    }

  })
})


import BotReactionType from '../types/BotReaction'
