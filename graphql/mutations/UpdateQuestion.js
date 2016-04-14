import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  QuestionStorage
} from '../../storage'

import QuestionType from '../types/QuestionType'


export default mutationWithClientMutationId({

  name: 'UpdateQuestion',

  inputFields: {
    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    },

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
    }
  },

  mutateAndGetPayload: async ({ questionID, content, severity }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let question = await QuestionStorage.load(fromGlobalId(questionID).id).catch(() => null)
    if (!question)
      return new Error('Question not found.')

    if (question.content !== content || question.severity !== severity)
      question = await QuestionStorage.update(question.id, { content, severity })

    return { question }
  }

})
