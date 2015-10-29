import {
  GraphQLID,
  GraphQLString,
  GraphQLList
} from 'graphql'

import ThemeType from '../types/UserType'
import ThemeStorage from '../../storage/ThemeStorage'

export default {
  type: new GraphQLList(ThemeType),
  args: {
    filter: {
      type: GraphQLString,
      defaultValue: 'related'
    }
  },
  resolve: (root, { filter }, { rootValue: { viewer }}) =>
    ThemeStorage.loadAll(filter, { userID: viewer.id })

}
