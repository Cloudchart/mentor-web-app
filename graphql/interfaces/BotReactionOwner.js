import {
  GraphQLInterfaceType
} from 'graphql'


export const Resolve = async (owner) => {

}


export default new GraphQLInterfaceType({
  name: 'BotReactionOwner',

  resolveType: (value) => {

  },

  fields: () => ({

    reaction: {
      type: BotReactionType,
    }

  })
})


import BotReactionType from '../types/BotReaction'
