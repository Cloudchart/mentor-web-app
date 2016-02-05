import {
  RoleStorage,
} from '../../storage'

import AdminType from '../types/admin/AdminType'


export default {
  type: AdminType,
  resolve: async (root, _, { rootValue: { viewer }}) => {
    return viewer && await RoleStorage.loadOne('adminByUser', { user_id: viewer.id }) ? viewer : null
  }
}
