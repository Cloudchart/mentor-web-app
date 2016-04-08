import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  connectionFromArray
} from './arrayconnection'


import {
  QuestionStorage
} from '../../storage'


import QuestionType from '../types/QuestionType'


export const Connection = connectionDefinitions({

  name: 'Questions',

  nodeType: QuestionType

})

export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {
  type: ConnectionType,

  args: {
    ...connectionArgs,
  },

  resolve: async (root, { ...args }, { rootValue: { viewer } }) => {
    let questions = await QuestionStorage.loadAll('all')
    return {
      ...connectionFromArray(questions, args),
    }
  }
}
