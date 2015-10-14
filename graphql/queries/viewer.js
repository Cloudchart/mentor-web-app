export default {
  type: UserType,
  resolve: (root, _, { rootValue: { viewer }}) => viewer
}

import { UserType } from '../types'
