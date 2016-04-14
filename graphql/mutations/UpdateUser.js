import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserStorage
} from '../../storage'


import UserType from '../types/UserType'


export default mutationWithClientMutationId({

  name: 'UpdateUser',

  inputFields: {
    email: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    }
  },

  outputFields: {
    user: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async (attributes, { rootValue: { viewer } }) => {
    attributes = ['name', 'email'].reduce((memo, attributeName) => {
      if (attributes[attributeName]) memo[attributeName] = attributes[attributeName]
      return memo
    }, {})

    let user = await UserStorage.update(viewer.id, attributes)

    return { user }
  }

})
