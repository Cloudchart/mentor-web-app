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
import UserThemeStorage, { forUser as UserThemeStorageForUser } from '../../storage/UserThemeStorage'

let ThemeFilterEnum = new GraphQLEnumType({
  name: 'ThemeFilterEnum',

  values: {
    DEFAULT:    { value: 'default'    },
    RELATED:    { value: 'related'    },
    UNRELATED:  { value: 'unrelated'  },
    SUBSCRIBED: { value: 'subscribed' },
  }
})

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
      resolve: (theme, {}, { rootValue: { viewer } }) =>
        UserThemeStorageForUser(viewer.id)
          .load(theme.id)
          .then(record => record.status === 'subscribed')
          .catch(error => false )
    }

  })

})

export { ThemeFilterEnum }
