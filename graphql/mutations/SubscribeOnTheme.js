import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'


import ThemeStorage from '../../storage/ThemeStorage'
import UserThemeStorage from '../../storage/UserThemeStorage'


export default mutationWithClientMutationId({

  name: 'SubscribeOnTheme',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    theme: {
      type: new GraphQLNonNull(ThemeType)
    }
  },

  mutateAndGetPayload: async ({ id }, { rootValue: { viewer } }) => {
    let theme = await ThemeStorage.load(id)
  }


})

import ThemeType from '../types/ThemeType'
