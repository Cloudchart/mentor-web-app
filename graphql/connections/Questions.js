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


export const QuestionsFilter = new GraphQLEnumType({
  name: 'QuestionFilter',

  values: {
    ALL:        { value: 'all'               },
    ANSWERED:   { value: 'answeredForUser'   },
    UNANSWERED: { value: 'unansweredForUser' },
  }
})

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
    filter: {
      type: QuestionsFilter,
      defaultValue: 'unansweredForUser',
    }
  },

  resolve: async (root, { filter, ...args }, { rootValue: { viewer } }) => {
    if (filter === 'all' && !viewer.isAdmin)
      return new Error('Not authorized.')

    let questions = await QuestionStorage.loadAll(filter, { user_id: viewer.id })

    return {
      ...connectionFromArray(questions, args),
    }
  }
}
