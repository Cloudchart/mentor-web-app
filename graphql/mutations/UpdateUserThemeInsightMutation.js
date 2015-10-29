import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import UserType from '../types/user_type'
import ThemeType from '../types/theme_type'
import UserThemeInsightType from '../types/UserThemeInsightType'

import ThemeStorage from '../../storage/NewThemeStorage'
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
    },
    theme: {
      type: new GraphQLNonNull(ThemeType),
      resolve: ({ insight: { theme_id } }) => ThemeStorage.load(theme_id)
    }
  },

  mutateAndGetPayload: async ({ id, rate }, { rootValue: { viewer }}) => {
    let insight = await UserThemeInsightStorage.update(id, { rate })
    return { insight, viewer }
  }

})
