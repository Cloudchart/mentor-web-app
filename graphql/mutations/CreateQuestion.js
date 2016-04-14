import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import QuestionType from '../types/QuestionType'
import AdminType from '../types/admin/AdminType'

import {
  EdgeType
} from '../connections/Questions'

import {
  nodeToEdge
} from '../connections/arrayconnection'

import {
  AdminStorage,
  QuestionStorage
} from '../../storage'


export default mutationWithClientMutationId({

  name: 'CreateQuestionMutation',

  inputFields: {

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    severity: {
      type: new GraphQLNonNull(GraphQLInt)
    }

  },

  outputFields: {
    question: {
      type: new GraphQLNonNull(QuestionType)
    },

    questionEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ question }) => nodeToEdge(question)
    },

    admin: {
      type: new GraphQLNonNull(AdminType)
    }
  },

  mutateAndGetPayload: async ({ content, severity }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin) return new Error('Not authorized.')

    let question = await QuestionStorage.create({ content, severity })
    let admin = await AdminStorage.load(viewer.id)

    return { question, admin }
  }

})
