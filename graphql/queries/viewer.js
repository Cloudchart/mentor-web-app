import {
  GraphQLID
} from 'graphql'

import UserType from '../types/UserType'

export default {
  type: UserType,
  resolve: (root, _, { rootValue: { viewer }}) => viewer
}
