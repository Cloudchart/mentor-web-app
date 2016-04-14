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


export default new GraphQLInterfaceType({
  name: 'BotReactionOwner',

  // resolveType: ({ __type }) => {
  //   switch(__type) {
  //     case 'Question':
  //       return require('../types/QuestionType')
  //   }
  // },

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
