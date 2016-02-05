import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  AdminThemeStorage
} from '../../../storage'

import {
  connectionFromArray
} from '../arrayconnection'

import AdminThemeType from '../../types/admin/AdminThemeType'


const adminThemesConnectionArgs = {
  ...connectionArgs,
  query: {
    type: GraphQLString,
  },
  filter: {
    type: GraphQLString,
  },
  order: {
    type: GraphQLString,
  },
}

export const adminThemesConnection = connectionDefinitions({
  name: 'AdminThemes',
  nodeType: AdminThemeType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
})

async function adminThemesConnectionResolve(obj, args) {
  let filter = args.filter || (args.query ? 'search' : 'default')
  let replacements = {}

  if (obj.__type === 'Insight') { replacements.insightID = obj.id }
  if (args.query) { replacements.query = args.query }

  let adminThemes = await AdminThemeStorage.loadAll(filter, replacements)
  return Object.assign(connectionFromArray(adminThemes, args), { count: adminThemes.length })
}


export const Field = {
  type: adminThemesConnection.connectionType,
  args: adminThemesConnectionArgs,
  resolve: adminThemesConnectionResolve
}
