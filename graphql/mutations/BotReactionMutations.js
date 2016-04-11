import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import BotReactionType from '../types/BotReaction'
import BotReactionOwnerInterface from '../interfaces/BotReactionOwner'


const InputFields = {

  ownerID: {
    type: new GraphQLNonNull(GraphQLID)
  },

  content: {
    type: new GraphQLNonNull(GraphQLString)
  },

  mood: {
    type: GraphQLString,
    defaultValue: 'positive',
  }

}


const OutputFields = {
  reaction: {
    type: new GraphQLNonNull(BotReactionType),
  },

  reactionEdge: {
    type: new GraphQLNonNull(GraphQLString),
  },

  owner: {
    type: new GraphQLNonNull(BotReactionOwnerInterface),
  },
}


export const AddBotReactionToOwnerMutation = mutationWithClientMutationId({

  name: 'AddBotReactionToOwnerMutation',

  inputFields: InputFields,

  outputFields: OutputFields,

  mutateAndGetPayload: async ({ ownerID, content, mood }, { rootValue: { viewer } }) => {
    return { reaction, owner }
  }

})
