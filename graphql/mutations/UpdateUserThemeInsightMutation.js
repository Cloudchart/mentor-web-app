import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import UserType from '../types/user_type'
import UserThemeInsightType from '../types/UserThemeInsightType'

import UserThemeInsightStorage from '../../storage/NewUserThemeInsightStorage'

export default mutationWithClientMutationId({

  name: 'UpdateUserThemeInsightMutation',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    rate: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },

  outputFields: {
    insightID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ insight }) => insight.id
    },
    insight: {
      type: new GraphQLNonNull(UserThemeInsightType)
    },
    viewer: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async ({ id, rate }, { rootValue: { viewer }}) => {
    try {
      let insight = await UserThemeInsightStorage.update(id, { rate })
      return { insight, viewer }
    } catch(e) {
      if (e.message === id) return new Error('Record not found')
      return e
    }
  }

})
