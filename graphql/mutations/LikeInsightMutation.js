import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserThemeInsightStorage
} from '../../storage'

import UserThemeInsightType from '../types/UserThemeInsightType'


export default mutationWithClientMutationId({

  name: 'LikeInsightMutation',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    rate: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },

  outputFields: {
    updatedInsight: {
      type: new GraphQLNonNull(UserThemeInsightType)
    }
  },

  mutateAndGetPayload: async ({ id, rate }, { rootValue: { viewer } }) => {
    let [userID, themeID, insightID] = id.split(':')
    if (userID !== viewer.id) return new Error('Not authorized')


    let userThemeInsight = await UserThemeInsightStorage.load(userID, themeID, insightID)

    rate = rate < 0 ? -1 : rate > 0 ? 1 : 0

    await UserThemeInsightStorage.update(userID, themeID, insightID, { rate: rate })

    let updatedInsight = await UserThemeInsightStorage.load(userID, themeID, insightID)

    return { updatedInsight }
  }

})
