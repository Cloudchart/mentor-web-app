import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions
} from 'graphql-relay'

import ThemeStorage from '../../storage/ThemeStorage'


export const themesConnection = connectionDefinitions({
  name: 'Themes',
  nodeType: ThemeType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  }
})

export const ThemesConnectionFilterEnum = new GraphQLEnumType({
  name: 'ThemeFilterEnum',

  values: {
    DEFAULT:    { value: 'default'    },
    RELATED:    { value: 'related'    },
    UNRELATED:  { value: 'unrelated'  },
    SUBSCRIBED: { value: 'subscribed' },
  }
})

export const themesConnectionArgs = {
  ...connectionArgs,
  filter: {
    type: ThemesConnectionFilterEnum,
    defaultValue: 'related'
  }
}

export function themesConnectionResolve(root, args, { rootValue: { viewer }}) {
  return ThemeStorage
    .loadAll(args.filter, { userID: viewer.id })
    .then(records => Object.assign(connectionFromArray(records, args), { count: records.length }))
}

export const field = {
  type:     themesConnection.connectionType,
  args:     themesConnectionArgs,
  resolve:  themesConnectionResolve
}

import ThemeType from '../types/ThemeType'
