import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  AdminThemeStorage,
  RoleStorage,
  AdminStorage,
} from '../../../storage'

import AdminType from '../../types/admin/AdminType'
import AdminThemeType from '../../types/admin/AdminThemeType'


export default mutationWithClientMutationId({

  name: 'UpdateTheme',

  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
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
      type: AdminType
    },
    theme: {
      type: AdminThemeType,
      resolve: (payload) => AdminThemeStorage.load(payload.theme.id)
    },
  },

  mutateAndGetPayload: async (payload, { rootValue: { viewer } }) => {
    if (viewer && await RoleStorage.loadOne('adminByUser', { user_id: viewer.id })) {

      if (!payload.name) throw new Error('Name is blank')

      let themeID = fromGlobalId(payload.id).id

      let theme = await AdminThemeStorage.update(themeID, {
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
