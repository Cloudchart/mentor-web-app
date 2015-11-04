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

let updateUserThemeInsightMutation = (name, rate) => mutationWithClientMutationId({

  name: name,

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
    let insight = await UserThemeInsightStorage.update(fromGlobalId(id).id, { rate: rate })
    return { insight }
  }

})

export const LikeInsightMutation      = updateUserThemeInsightMutation('likeInsight', 1)
export const DislikeInsightMutation   = updateUserThemeInsightMutation('dislikeInsight', -1)
