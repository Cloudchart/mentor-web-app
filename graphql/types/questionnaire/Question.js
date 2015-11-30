import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField,
} from 'graphql-relay'

import {
  AnswerStorage,
} from '../../../storage'


export default new GraphQLObjectType({

  name: 'QuestionnaireQuestion',

  fields: () => ({

    id: globalIdField('QuestionnaireQuestion'),

    intro: {
      type: new GraphQLNonNull(GraphQLString),
    },

    outro: {
      type: new GraphQLNonNull(GraphQLString),
    },

    position: {
      type: new GraphQLNonNull(GraphQLInt),
    },

    answers: {
      type: new GraphQLList(Answer),
      resolve: ({ id }) => AnswerStorage.loadAll('forQuestion', { questionID: id })
    },

  }),

})
