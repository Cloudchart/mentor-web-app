import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserStorage,
  UserThemeStorage,
  UserThemeInsightStorage
} from '../../storage'

import UserType from '../types/UserType'
import UserThemeType from '../types/UserThemeType'
import UserThemeInsightType from '../types/UserThemeInsightType'

export default mutationWithClientMutationId({

  name: 'LikeInsight',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: ({ insight: { user_id } }) => UserStorage.load(user_id)
    },
    theme: {
      type: new GraphQLNonNull(UserThemeType),
      resolve: ({ insight: { user_id, theme_id } }) => UserThemeStorage.loadOne('unique', { userID: user_id, themeID: theme_id })
    },
    insight: {
      type: new GraphQLNonNull(UserThemeInsightType)
    }
  },

  mutateAndGetPayload: async ({ id }) => {
    let insightId  = fromGlobalId(id).id
    let insight    = await UserThemeInsightStorage.load(insightId)
    return { insight }
  }

})
