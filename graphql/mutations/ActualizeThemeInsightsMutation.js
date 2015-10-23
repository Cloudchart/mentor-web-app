import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  ThemeStorage
} from '../../storage'

import ActualizeThemeInsights from '../../workers/jobs/ActualizeThemeInsights'


export default mutationWithClientMutationId({

  name: 'ActualizeThemeInsightsMutation',

  inputFields: {
    themeID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    timeTaken: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },

  mutateAndGetPayload: async({ themeID }) => {
    try {
      let theme = await ThemeStorage.load(themeID)
    } catch(error) {
      return new Error('Not found')
    }

    return ActualizeThemeInsights
      .performAsync({ themeID })
      .then((timeTaken) => ({ timeTaken }))
  }

})
