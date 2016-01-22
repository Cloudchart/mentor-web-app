import {
  RoleStorage,
} from '../../storage'

import AdminType from '../types/admin/AdminType'


export default {
  type: AdminType,
  resolve: async (root, _, { rootValue: { viewer }}) => {
    if (!viewer) return null
    let role = await RoleStorage.loadOne('byNameForUser', { user_id: viewer.id, name: 'admin' })
    return role ? viewer : null
  }
}
