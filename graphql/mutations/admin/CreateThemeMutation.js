import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} from 'graphql-relay'

import {
  AdminThemeStorage,
  RoleStorage,
  AdminStorage,
} from '../../../storage'

import AdminType from '../../types/admin/AdminType'
import { adminThemesConnection } from '../../connections/admin/AdminThemesConnection'


export default mutationWithClientMutationId({

  name: 'CreateTheme',

  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    isSystem: {
      type: GraphQLBoolean
    },
    isDefault: {
      type: GraphQLBoolean
    },
  },

  outputFields: {
    admin: {
      type: AdminType,
      resolve: (payload) => {
        console.log('>>>', 'outputFields', 'admin', 'resolve', payload);
        return AdminStorage.load(payload.adminID)
      }
    },
    themeEdge: {
      type: adminThemesConnection.edgeType,
      resolve: (payload) => {
        console.log('>>>', 'outputFields', 'themeEdge', 'resolve', payload);
        // TODO: figure out how to return edge
        return { node: {}, cursor: ''}
      }
    },
  },

  mutateAndGetPayload: async (payload, { rootValue: { viewer } }) => {
    if (viewer && await RoleStorage.loadOne('adminByUser', { user_id: viewer.id })) {

      if (!payload.name) throw new Error('Name is blank')

      let theme = await AdminThemeStorage.create({
        name: payload.name,
        is_system: payload.isSystem,
        is_default: payload.isDefault,
      })

      return { adminID: viewer.id, theme }
    } else {
      throw new Error('Not authorized')
    }
  }

})
