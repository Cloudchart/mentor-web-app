import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'

import ThemeType from '../types/theme_type'
import { Theme as ThemeModel } from '../../models'

let Themes = {
  type: new GraphQLList(ThemeType),
  args: {
    kind: {
      type: new GraphQLNonNull(ThemeType.ThemeKind)
    }
  },
  resolve: (_, { kind }) => {
    let query = { where: {} } ; query.where[kind] = true
    return ThemeModel.findAll(query)
  }
}

let Theme = {
  type: ThemeType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: (_, { id }) => ThemeModel.findById(id)
}

export { Theme, Themes }
