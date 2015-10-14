import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

import { mutationWithClientMutationId } from 'graphql-relay'

import { Theme } from '../../models'
import { ThemeType } from '../types'

export default mutationWithClientMutationId({
  name: 'ThemeToViewer',

  inputFields: {
    themeId: {
      type:     new GraphQLNonNull(GraphQLID)
    },
    action: {
      type:     new GraphQLNonNull(GraphQLString)
    }
  },

  outputFields: {
    theme: {
      type: ThemeType
    }
  },

  mutateAndGetPayload: ({ themeId, action }, { rootValue: { viewer } }) => {
    return Theme.findById(themeId).then(theme => {
      return theme[action + 'User'](viewer).then(() => {
        return {
          theme: theme
        }
      })
    })
  }
})
