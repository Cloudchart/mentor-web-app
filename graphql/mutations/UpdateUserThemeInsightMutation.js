import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  toGlobalId,
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
    },
    insightID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ insight }) => toGlobalId('UserThemeInsight', insight.id)
    }
  },

  mutateAndGetPayload: async ({ id }, { rootValue: { viewer } }) => {
    let insight = await UserThemeInsightStorage.load(fromGlobalId(id).id)

    if (insight.user_id !== viewer.id)
      return new Error('Not authorized')

    let updatedAt = rate == 1 || rate == -1 ? null : insight.updated_at
    insight = await UserThemeInsightStorage.update(insight.id, { rate: rate, updated_at: updatedAt })
    return { insight }
  }

})

export const LikeInsightMutation        = updateUserThemeInsightMutation('LikeInsight',            1)
export const MarkInsightUsefulMutation  = updateUserThemeInsightMutation('MarkInsightUseful',      2)
export const DislikeInsightMutation     = updateUserThemeInsightMutation('DislikeInsight',        -1)
export const MarkInsightUselessMutation = updateUserThemeInsightMutation('MarkInsightUseless',    -2)
export const ResetInsightMutation       = updateUserThemeInsightMutation('ResetInsight',        null)
