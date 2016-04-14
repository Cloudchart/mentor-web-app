import {
  AdminStorage,
  RoleStorage,
} from '../../storage'

import AdminType from '../types/admin/AdminType'


export default {
  type: AdminType,
  resolve: async (root, _, { rootValue: { viewer }}) => {
    let admin = await AdminStorage.load(viewer.id).catch(() => null)
    return admin && await RoleStorage.loadOne('adminByUser', { user_id: admin.id }) ? admin : null
  }
}
