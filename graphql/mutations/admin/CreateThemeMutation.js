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
  ThemeStorage,
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
      resolve: (payload, _, { rootValue: { viewer } }) => AdminStorage.load(viewer.id)
    },
    themeEdge: {
      type: adminThemesConnection.edgeType,
      resolve: () => {
        // TODO: figure this out
        console.log('outputFields', 'themeEdge', 'resolve');
        return { node: {}, cursor: ''}
      }
    },
  },

  mutateAndGetPayload: async (payload, { rootValue: { viewer } }) => {
    if (viewer && await RoleStorage.loadOne('adminByUser', { user_id: viewer.id })) {

      let theme = await ThemeStorage.create({
        name: payload.name,
        is_system: payload.isSystem,
        is_default: payload.isDefault,
      })

      return { theme }
    } else {
      throw new Error('Not authorized')
    }
  }

})
