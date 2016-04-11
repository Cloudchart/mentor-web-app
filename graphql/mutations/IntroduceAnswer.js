import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  nodeToEdge
} from '../connections/arrayconnection'

import {
  EdgeType
} from '../connections/QuestionAnswers'

import {
  AnswerStorage,
  QuestionStorage,
} from '../../storage'

import AnswerType from '../types/AnswerType'
import QuestionType from '../types/QuestionType'


export default mutationWithClientMutationId({

  name: 'IntroduceAnswer',

  inputFields: {
    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    content: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },

  outputFields: {
    answer: {
      type: new GraphQLNonNull(AnswerType)
    },
    question: {
      type: new GraphQLNonNull(QuestionType)
    },
    answerEdge: {
      type: new GraphQLNonNull(EdgeType),
      resolve: ({ answer }) => nodeToEdge(answer)
    }
  },

  mutateAndGetPayload: async ({ questionID, content, reactionContent }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let question = await QuestionStorage.load(fromGlobalId(questionID).id).catch(() => null)
    if (!question)
      return new Error('Question not found.')

    let lastAnswer = await AnswerStorage.loadOne('lastForQuestion', { question_id: question.id }).catch(() => null)
    let position = lastAnswer ? lastAnswer.position + 1 : 0

    let answer = await AnswerStorage.create({ content, question_id: question.id, position })

    return { answer, question }
  }

})
