import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray
} from 'graphql-relay'

import {
  AnswerStorage
} from '../../storage'

import AnswerType from '../types/AnswerType'


export const Connection = connectionDefinitions({

  name: 'QuestionAnswers',

  nodeType: AnswerType,

  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ question }) => await AnswerStorage.count('allForQuestion', { question_id: question.id })
    }
  }

})

export const EdgeType = Connection.edgeType
export const ConnectionType = Connection.connectionType


export default {
  type: ConnectionType,

  args: {
    ...connectionArgs,
  },

  resolve: async (question, { ...args }) => {
    let answers = await AnswerStorage.loadAll('allForQuestion', { question_id: question.id })
    return {
      ...connectionFromArray(answers, args),
      question,
    }
  }
}
