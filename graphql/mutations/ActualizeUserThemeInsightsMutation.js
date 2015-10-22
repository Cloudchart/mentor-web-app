import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserThemeStorage
} from '../../storage'

import ActualizeUserThemeInsights from '../../workers/jobs/ActualizeUserThemeInsights'

export default mutationWithClientMutationId({

  name: 'ActualizeUserThemeInsightsMutation',

  inputFields: {
    userID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    themeID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    newInsightsCount: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    timeTaken: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },

  mutateAndGetPayload: async ({ userID, themeID }, { rootValue: { viewer } }) => {
    if (viewer.id !== userID)
      return new Error('Not authorized')

    let userTheme = await UserThemeStorage.load(userID, themeID)

    if (!userTheme)
      return new Error('Not found')

    return ActualizeUserThemeInsights
      .performAsync({ userID, themeID })
      .then(([newInsightsCount, timeTaken]) => ({ newInsightsCount, timeTaken }))
  }

})
