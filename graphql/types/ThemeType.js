import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from './Node'
import UserThemeStorage from '../../storage/UserThemeStorage'

let ThemeFilterEnum = new GraphQLEnumType({
  name: 'ThemeFilterEnum',

  values: {
    DEFAULT:    { value: 'default'    },
    RELATED:    { value: 'related'    },
    UNRELATED:  { value: 'unrelated'  },
    SUBSCRIBED: { value: 'subscribed' },
  }
})


let resolveThemeStatus = (theme, {}, { rootValue: { viewer }}) =>
  UserThemeStorage
    .forUser(viewer.id)
    .load(theme.id)
    .then(record => record.status)
    .catch(error => null)


export default new GraphQLObjectType({

  name: 'Theme',

  interfaces: [nodeInterface],

  fields: () => ({

    id: globalIdField('Theme'),

    name: {
      type: GraphQLString
    },

    isSystem: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ is_system }) => !!is_system
    },

    isDefault: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ is_default }) => !!is_default
    },

    isSubscribed: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (...args) =>
        resolveThemeStatus(...args)
          .then(status => status === 'subscribed')
    },

    isRejected: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (...args) =>
        resolveThemeStatus(...args)
          .then(status => status === 'rejected')
    }

  })

})

export { ThemeFilterEnum }
