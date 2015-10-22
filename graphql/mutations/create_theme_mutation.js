import {
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  ThemeType
} from '../types'

import {
  ThemesStorage
} from '../../storage'

export default mutationWithClientMutationId({

  name: 'CreateThemeMutation',

  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },

  outputFields: {
    theme: {
      type: new GraphQLNonNull(ThemeType)
    }
  },

  mutateAndGetPayload: async ({ name }) => {
    name = name.toLowerCase()

    let theme = await ThemesStorage.loadByName(name)
    if (!theme) theme = await ThemesStorage.create({ name: name })

    return { theme }
  }

})
