import {
  GraphQLID,
  GraphQLString,
  GraphQLList
} from 'graphql'


import {
  connectionArgs,
  connectionFromArray
} from 'graphql-relay'


import { ThemeFilterEnum } from '../types/ThemeType'
import { connectionType } from '../connections/ThemesConnection'
import ThemeStorage from '../../storage/ThemeStorage'

export default {
  type: connectionType,
  args: {
    ...connectionArgs,
    filter: {
      type: ThemeFilterEnum,
      defaultValue: 'related'
    }
  },
  resolve: (root, args, { rootValue: { viewer }}) =>
    ThemeStorage
      .loadAll(args.filter, { userID: viewer.id })
      .then(records => connectionFromArray(records, args))

}
