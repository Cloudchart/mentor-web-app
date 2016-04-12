import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  QuestionStorage
} from '../../storage'


export default mutationWithClientMutationId({

  name: 'UpdateQuestion',

  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    severity: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },

  outputFields: {

  },

  mutateAndGetPayload: async ({}, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')
  }

})
