import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

export default {
  type: ThemeType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: (_, { id }) => Theme.findById(id)
}

import { Theme } from '../../models'
import { ThemeType } from '../types'
