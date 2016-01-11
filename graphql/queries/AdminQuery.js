import {
  GraphQLID
} from 'graphql'

import AdminType from '../types/AdminType'


export default {
  type: AdminType,
  resolve: (root, _, { rootValue: { admin }}) => admin
}
