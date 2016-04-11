import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import { nodeInterface } from './Node'

import botReactionOwnerInterface, {
  Resolve as resolveReaction
} from '../interfaces/BotReactionOwner'

import QuestionAnswersConnection from '../connections/QuestionAnswers'


export default new GraphQLObjectType({

  name: 'Question',

  interfaces: [nodeInterface, botReactionOwnerInterface],

  isTypeOf: ({ __type }) => __type === 'Question',

  fields: () => ({

    id: globalIdField('Question'),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    isPublished: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ is_published }) => is_published
    },

    severity: {
      type: new GraphQLNonNull(GraphQLInt)
    },

    answers: QuestionAnswersConnection,

    reaction: {
      type: BotReactionType,
      resolve: resolveReaction,
    }

  })

})


import BotReactionType from './BotReaction'
